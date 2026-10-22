"""Billing API.

* the catalog (public),
* the caller's subscription state, optionally refreshed from Stripe,
* Stripe-hosted Checkout and Billing Portal session creation,
* billing history,
* the Stripe webhook that keeps the database in step.

Card data never touches this API: the app only ever receives a hosted URL.
"""
from __future__ import annotations

import logging
from urllib.parse import quote

import stripe
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.http import HttpResponseRedirect
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from billing import plans, services
from billing.exceptions import (
    AlreadySubscribed,
    NoBillingAccount,
    PaymentsNotConfigured,
    PaymentProviderError,
)
from billing.models import Subscription, WebhookEvent
from billing.stripe_client import (
    WebhookVerificationError,
    construct_webhook_event,
    get_stripe_client,
)

logger = logging.getLogger(__name__)

User = get_user_model()


class PlansView(APIView):
    """GET /api/billing/plans — public price list, without Stripe price ids."""

    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'plans': [plans.serialize_plan(plan) for plan in plans.PLANS]})


class SubscriptionView(APIView):
    """GET /api/billing/subscription[?refresh=1] — the caller's plan."""

    def get(self, request):
        row = Subscription.objects.filter(user=request.user).first()

        refresh = request.query_params.get('refresh', '').lower() in ('1', 'true', 'yes')
        if refresh and row and row.stripe_customer_id:
            # Covers webhook delivery delay: ask Stripe directly before answering.
            try:
                row = services.sync_subscription_from_stripe(user=request.user)
            except stripe.StripeError:
                logger.warning(
                    'Could not refresh subscription for user %s from Stripe.',
                    request.user.id,
                )

        return Response({'subscription': services.serialize_subscription(row)})


class CheckoutView(APIView):
    """POST /api/billing/checkout — a Stripe Checkout session URL."""

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'billing'

    def post(self, request):
        data = request.data if isinstance(request.data, dict) else {}
        plan_id = str(data.get('plan') or '').strip()
        interval = str(data.get('interval') or '').strip()

        errors: dict[str, list[str]] = {}
        if plan_id not in plans.PLAN_IDS:
            errors['plan'] = ['Choose a valid plan.']
        if interval not in plans.INTERVALS:
            errors['interval'] = ["Choose 'month' or 'year'."]
        if errors:
            raise ValidationError(errors)

        raw_return_url = data.get('returnUrl')
        return_base = settings.FRONTEND_URL
        if raw_return_url not in (None, ''):
            if not services.is_allowed_return_url(raw_return_url):
                raise ValidationError({'returnUrl': ['This return URL is not allowed.']})
            return_base = str(raw_return_url).strip().rstrip('/')

        # An existing plan outranks configuration: the answer is "use Manage
        # billing", not "payments are down".
        row = services.row_for_user(request.user)
        if row.is_active:
            raise AlreadySubscribed()

        price_id = plans.price_id_for(plan_id, interval)
        if not price_id:
            # Key present but the catalog is incomplete: still "not set up".
            logger.warning(
                'No Stripe price configured for %s/%s (see docs/BILLING_SETUP.md).',
                plan_id,
                interval,
            )
            raise PaymentsNotConfigured()

        customer_id = services.ensure_customer(request.user)
        origin = settings.PUBLIC_API_ORIGIN
        to_param = quote(return_base, safe='')

        params = {
            'mode': 'subscription',
            'customer': customer_id,
            'line_items': [{'price': price_id, 'quantity': 1}],
            'client_reference_id': str(request.user.id),
            'metadata': {
                'user_id': str(request.user.id),
                'plan': plan_id,
                'interval': interval,
            },
            'subscription_data': {
                'metadata': {
                    'user_id': str(request.user.id),
                    'plan': plan_id,
                    'interval': interval,
                }
            },
            'allow_promotion_codes': False,
            'billing_address_collection': 'auto',
            'success_url': (
                f'{origin}/api/billing/return?status=success'
                f'&session_id={{CHECKOUT_SESSION_ID}}&to={to_param}'
            ),
            'cancel_url': f'{origin}/api/billing/return?status=cancel&to={to_param}',
        }

        try:
            session = get_stripe_client().v1.checkout.sessions.create(params)
        except stripe.StripeError:
            logger.exception('Stripe Checkout session creation failed.')
            raise PaymentProviderError()

        url = services.text_field(session, 'url')
        if not url:
            raise PaymentProviderError()
        return Response({'url': url})


class ReturnView(APIView):
    """GET /api/billing/return — bounces Stripe's redirect back into the app.

    Stripe needs an https URL it can reach, but the app lives on the Expo web
    origin or a native deep link. This view only forwards to an allowlisted
    base and never trusts or echoes any other parameter.
    """

    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = []

    def get(self, request):
        status_param = request.query_params.get('status')
        base = services.sanitized_return_url(request.query_params.get('to'))

        if status_param == 'success':
            target = services.join_url(base, 'billing/success')
            session_id = request.query_params.get('session_id')
            if session_id:
                target = f'{target}?session_id={quote(session_id, safe="")}'
        elif status_param == 'cancel':
            target = services.join_url(base, 'billing/cancel')
        else:
            target = settings.FRONTEND_URL

        return HttpResponseRedirect(target)


class PortalView(APIView):
    """POST /api/billing/portal — a Stripe Billing Portal session URL."""

    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'billing'

    def post(self, request):
        data = request.data if isinstance(request.data, dict) else {}
        raw_return_url = data.get('returnUrl')
        if raw_return_url not in (None, ''):
            if not services.is_allowed_return_url(raw_return_url):
                raise ValidationError({'returnUrl': ['This return URL is not allowed.']})
            return_url = str(raw_return_url).strip()
            if '?' not in return_url:
                return_url = services.join_url(return_url, 'profile?tab=billing')
        else:
            return_url = f'{settings.FRONTEND_URL}/profile?tab=billing'

        row = Subscription.objects.filter(user=request.user).first()
        if row is None or not row.stripe_customer_id:
            raise NoBillingAccount()

        try:
            session = get_stripe_client().v1.billing_portal.sessions.create(
                {'customer': row.stripe_customer_id, 'return_url': return_url}
            )
        except stripe.StripeError:
            logger.exception('Stripe Billing Portal session creation failed.')
            raise PaymentProviderError()

        url = services.text_field(session, 'url')
        if not url:
            raise PaymentProviderError()
        return Response({'url': url})


class InvoicesView(APIView):
    """GET /api/billing/invoices — the last 12 invoices, newest first."""

    def get(self, request):
        row = Subscription.objects.filter(user=request.user).first()
        if row is None or not row.stripe_customer_id:
            return Response({'invoices': []})

        try:
            listing = get_stripe_client().v1.invoices.list(
                {
                    'customer': row.stripe_customer_id,
                    'limit': services.MAX_INVOICES,
                }
            )
        except stripe.StripeError:
            logger.warning('Could not list Stripe invoices for user %s.', request.user.id)
            raise PaymentProviderError()

        invoices = [
            services.serialize_invoice(invoice)
            for invoice in (services.get_field(listing, 'data') or [])
        ]
        return Response({'invoices': invoices})


class WebhookView(APIView):
    """POST /api/billing/webhook — Stripe events, signature-verified.

    ``authentication_classes`` and throttling are disabled: Stripe has no token
    and rate-limiting a payment provider would drop events. Idempotency is
    per event id.
    """

    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = []

    def post(self, request):
        signature = request.headers.get('Stripe-Signature', '')
        try:
            event = construct_webhook_event(request.body, signature)
        except PaymentsNotConfigured:
            return Response(
                {'code': 'PAYMENTS_NOT_CONFIGURED', 'message': "Payments aren't set up yet."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except WebhookVerificationError:
            logger.warning('Rejected Stripe webhook with an invalid signature.')
            return Response(
                {'code': 'INVALID_SIGNATURE', 'message': 'Invalid webhook signature.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        event_id = services.get_field(event, 'id')
        event_type = services.get_field(event, 'type') or ''
        if not event_id:
            return Response(
                {'code': 'VALIDATION', 'message': 'Missing event id.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            with transaction.atomic():
                _, created = WebhookEvent.objects.get_or_create(
                    event_id=str(event_id),
                    defaults={'type': str(event_type)[:120]},
                )
                if not created:
                    # Already handled: 200 so Stripe stops retrying.
                    logger.info('Stripe event %s already processed.', event_id)
                    return Response({'received': True, 'duplicate': True})

                data_object = services.get_field(services.get_field(event, 'data'), 'object')
                handle_event(str(event_type), data_object)
        except stripe.StripeError:
            # Roll back the WebhookEvent row so Stripe's retry can succeed.
            logger.exception('Stripe error while handling event %s.', event_id)
            return Response(
                {'code': 'PAYMENTS_ERROR', 'message': 'Payment provider error.'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        logger.info('Handled Stripe event %s.', event_id)
        return Response({'received': True})


# --- webhook event handlers -----------------------------------------------


def _find_row_by_customer(customer_id: str) -> Subscription | None:
    if not customer_id:
        return None
    return Subscription.objects.filter(stripe_customer_id=customer_id).first()


def _row_from_metadata(obj) -> Subscription | None:
    """Fallback for events that arrive before the customer id is stored."""
    user_id = services.get_field(services.get_field(obj, 'metadata'), 'user_id')
    if not user_id:
        return None
    try:
        return Subscription.objects.filter(user_id=user_id).first()
    except (DjangoValidationError, ValueError, TypeError):
        return None


def handle_checkout_completed(session) -> None:
    user_id = (
        services.get_field(session, 'client_reference_id')
        or services.get_field(services.get_field(session, 'metadata'), 'user_id')
    )
    customer_id = services.stripe_id_field(session, 'customer')
    subscription_id = services.stripe_id_field(session, 'subscription')

    if not user_id:
        logger.warning('checkout.session.completed without a client_reference_id; ignoring.')
        return

    try:
        user = User.objects.filter(pk=user_id).first()
    except (DjangoValidationError, ValueError, TypeError):
        user = None
    if user is None:
        logger.warning('checkout.session.completed for an unknown user; ignoring.')
        return

    row = services.row_for_user(user)
    if customer_id:
        row.stripe_customer_id = customer_id
    if subscription_id:
        row.stripe_subscription_id = subscription_id
    row.save(update_fields=['stripe_customer_id', 'stripe_subscription_id', 'updated_at'])

    # The session only says a subscription exists; Stripe is the source of
    # truth for its status, price and period.
    services.sync_subscription_from_stripe(user=user)


def handle_subscription_event(stripe_subscription, *, canceled: bool) -> None:
    customer_id = services.stripe_id_field(stripe_subscription, 'customer')
    row = _find_row_by_customer(customer_id)
    if row is None:
        row = _row_from_metadata(stripe_subscription)
        if row is not None and customer_id:
            row.stripe_customer_id = customer_id
            row.save(update_fields=['stripe_customer_id', 'updated_at'])
    if row is None:
        logger.warning(
            'Subscription event for customer %s has no local user; ignoring.',
            customer_id or '(none)',
        )
        return

    services.apply_stripe_subscription(row, stripe_subscription, canceled=canceled)


def handle_invoice_event(invoice) -> None:
    customer_id = services.stripe_id_field(invoice, 'customer')
    row = _find_row_by_customer(customer_id)
    if row is None:
        logger.warning(
            'Invoice event for customer %s has no local user; ignoring.',
            customer_id or '(none)',
        )
        return
    # Re-read from Stripe so the status becomes past_due / active.
    services.sync_subscription_from_stripe(user=row.user)


def handle_event(event_type: str, data_object) -> None:
    """Dispatch one verified event. Unknown types are acknowledged silently."""
    if event_type == 'checkout.session.completed':
        handle_checkout_completed(data_object)
    elif event_type.startswith('customer.subscription.'):
        handle_subscription_event(
            data_object, canceled=event_type == 'customer.subscription.deleted'
        )
    elif event_type in ('invoice.paid', 'invoice.payment_failed'):
        handle_invoice_event(data_object)
    else:
        logger.info('Ignoring Stripe event type %s.', event_type)
