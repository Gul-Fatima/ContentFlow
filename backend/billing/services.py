"""Stripe <-> database synchronisation plus the return-URL allowlist.

``sync_subscription_from_stripe`` is the single writer of subscription state:
both the webhook and ``GET /api/billing/subscription?refresh=1`` call it, so a
delayed webhook and a manual refresh can never disagree.
"""
from __future__ import annotations

import logging
from datetime import datetime, timezone as dt_timezone

from django.conf import settings

from billing import plans
from billing.models import Subscription
from billing.stripe_client import get_stripe_client

logger = logging.getLogger(__name__)

# Statuses that mean Stripe still considers this the customer's live plan.
_LIVE_STATUSES = ('active', 'trialing', 'past_due', 'unpaid', 'incomplete', 'paused')

MAX_INVOICES = 12


# --- small Stripe-object helpers ------------------------------------------


def get_field(obj, key, default=None):
    """Read a field from a StripeObject, a dict or a plain attribute holder."""
    if obj is None:
        return default
    if isinstance(obj, dict):
        return obj.get(key, default)
    try:
        value = obj[key]
    except (KeyError, TypeError, AttributeError):
        value = getattr(obj, key, default)
    return default if value is None else value


def stripe_id_field(obj, key) -> str:
    """The id of a possibly-expanded Stripe reference (string, object or None)."""
    return text_field(obj, key)


def text_field(obj, key) -> str:
    """A string field, tolerating expanded objects where an id was expected."""
    value = get_field(obj, key)
    if isinstance(value, str):
        return value
    return get_field(value, 'id', '') or ''


def _items(stripe_subscription) -> list:
    return list(get_field(get_field(stripe_subscription, 'items'), 'data') or [])


def _price_id(stripe_subscription) -> str | None:
    for item in _items(stripe_subscription):
        price = get_field(item, 'price')
        price_id = get_field(price, 'id')
        if price_id:
            return price_id
    # Older API versions exposed a single `plan` object instead of items.
    legacy_plan = get_field(stripe_subscription, 'plan')
    return get_field(legacy_plan, 'id')


def _period_end(stripe_subscription) -> datetime | None:
    timestamp = get_field(stripe_subscription, 'current_period_end')
    if not timestamp:
        # 2025+ API versions moved the period onto the subscription items.
        for item in _items(stripe_subscription):
            timestamp = get_field(item, 'current_period_end')
            if timestamp:
                break
    if not timestamp:
        return None
    try:
        return datetime.fromtimestamp(int(timestamp), tz=dt_timezone.utc)
    except (TypeError, ValueError, OSError):
        return None


def iso(value: datetime | None) -> str | None:
    if not value:
        return None
    if value.tzinfo is None:
        value = value.replace(tzinfo=dt_timezone.utc)
    return value.astimezone(dt_timezone.utc).isoformat().replace('+00:00', 'Z')


# --- serialisation ---------------------------------------------------------


def serialize_subscription(row: Subscription | None) -> dict:
    """Public subscription shape. A missing row is the 'none' plan."""
    plan_id = row.plan if row else 'none'
    limits = plans.limits_for_plan(plan_id)
    return {
        'plan': plan_id,
        'interval': (row.interval or None) if row else None,
        'status': row.status if row else 'none',
        'isActive': bool(row and row.is_active),
        'currentPeriodEnd': iso(row.current_period_end) if row else None,
        'cancelAtPeriodEnd': bool(row.cancel_at_period_end) if row else False,
        'usage': {
            'postsUsed': row.posts_used if row else 0,
            'postsLimit': limits.get('postsPerMonth'),
            'creditsUsed': row.credits_used if row else 0,
            'creditsLimit': limits.get('credits'),
        },
        'limits': limits,
    }


def serialize_invoice(invoice) -> dict:
    """One row of billing history. Links point at Stripe's hosted invoice."""
    created = get_field(invoice, 'created')
    created_at = None
    if created:
        try:
            created_at = datetime.fromtimestamp(int(created), tz=dt_timezone.utc)
        except (TypeError, ValueError, OSError):
            created_at = None
    return {
        'id': get_field(invoice, 'id', '') or '',
        'number': get_field(invoice, 'number') or '',
        'amountCents': int(get_field(invoice, 'amount_paid') or get_field(invoice, 'total') or 0),
        'currency': (get_field(invoice, 'currency') or 'usd').lower(),
        'status': get_field(invoice, 'status') or 'open',
        'createdAt': iso(created_at),
        'hostedInvoiceUrl': get_field(invoice, 'hosted_invoice_url') or None,
        'pdfUrl': get_field(invoice, 'invoice_pdf') or None,
    }


# --- return-URL allowlist --------------------------------------------------


def is_allowed_return_url(value) -> bool:
    """Only our own frontend, the app's deep-link scheme, or Expo dev links.

    This stops the checkout redirect from being used as an open redirect to an
    attacker's origin (``FRONTEND_URL`` without a path boundary would otherwise
    accept ``http://localhost:8081.evil.com``).
    """
    if not isinstance(value, str) or not value.strip():
        return False
    url = value.strip()

    frontend = (getattr(settings, 'FRONTEND_URL', '') or '').rstrip('/')
    if frontend and (url == frontend or url.startswith(f'{frontend}/')):
        return True

    scheme = (getattr(settings, 'APP_SCHEME', '') or '').strip()
    if scheme and url.startswith(f'{scheme}://'):
        return True

    if getattr(settings, 'DEBUG', False) and url.startswith('exp://'):
        return True

    return False


def sanitized_return_url(value) -> str:
    """The validated return base, falling back to the web frontend."""
    if is_allowed_return_url(value):
        return value.strip().rstrip('/')
    return (getattr(settings, 'FRONTEND_URL', '') or '').rstrip('/')


def join_url(base: str, path: str) -> str:
    """Join a base and a path without doubling or dropping separators.

    Handles scheme-only bases such as ``agentai://`` or ``exp://host:8081/--``.
    """
    base = (base or '').rstrip('/')
    path = (path or '').lstrip('/')
    if not base:
        return path
    if base.endswith(':'):
        return f'{base}//{path}'
    return f'{base}/{path}'


# --- synchronisation -------------------------------------------------------


def row_for_user(user) -> Subscription:
    row, _ = Subscription.objects.get_or_create(user=user)
    return row


def ensure_customer(user) -> str:
    """Return the user's Stripe customer id, creating it on first checkout."""
    row = row_for_user(user)
    if row.stripe_customer_id:
        return row.stripe_customer_id

    client = get_stripe_client()
    customer = client.v1.customers.create(
        {
            'email': user.email,
            'name': user.name or None,
            'metadata': {'user_id': str(user.id)},
        }
    )
    customer_id = get_field(customer, 'id', '') or ''
    row.stripe_customer_id = customer_id
    row.save(update_fields=['stripe_customer_id', 'updated_at'])
    logger.info('Created Stripe customer %s for user %s', customer_id, user.id)
    return customer_id


def apply_stripe_subscription(
    row: Subscription,
    stripe_subscription,
    *,
    canceled: bool = False,
) -> Subscription:
    """Mirror one Stripe subscription onto ``row`` and save it."""
    status_value = (get_field(stripe_subscription, 'status') or '').strip()

    stripe_subscription_id = get_field(stripe_subscription, 'id')
    if stripe_subscription_id:
        row.stripe_subscription_id = stripe_subscription_id

    # The customer may arrive expanded as an object in newer API versions.
    customer_id = stripe_id_field(stripe_subscription, 'customer')
    if customer_id:
        row.stripe_customer_id = customer_id

    row.cancel_at_period_end = bool(get_field(stripe_subscription, 'cancel_at_period_end'))
    period_end = _period_end(stripe_subscription)
    if period_end:
        row.current_period_end = period_end

    price_id = _price_id(stripe_subscription)
    mapped = plans.plan_for_price_id(price_id) if price_id else None
    if mapped:
        row.plan, row.interval = mapped
    elif price_id:
        # A price created outside this catalog: keep what the user has and let
        # the operator notice, rather than silently downgrading a paying user.
        logger.warning(
            'Unknown Stripe price id %s on subscription %s (user %s); plan unchanged.',
            price_id,
            stripe_subscription_id,
            row.user_id,
        )

    if canceled or status_value == 'canceled':
        row.plan = 'none'
        row.status = 'canceled'
    else:
        row.status = status_value or row.status

    row.save()
    return row


def sync_subscription_from_stripe(user=None, customer_id: str | None = None) -> Subscription | None:
    """Fetch the customer's current subscription from Stripe and mirror it.

    Used by ``?refresh=1`` and by the webhook. Returns None when there is no
    row to sync and no user to attach one to.
    """
    row = None
    if user is not None:
        row = Subscription.objects.filter(user=user).first()
    if row is None and customer_id:
        row = Subscription.objects.filter(stripe_customer_id=customer_id).first()
    if row is None:
        if user is None:
            return None
        row = Subscription.objects.create(user=user)

    customer = customer_id or row.stripe_customer_id
    if not customer:
        return row

    client = get_stripe_client()
    listing = client.v1.subscriptions.list(
        {'customer': customer, 'status': 'all', 'limit': 10}
    )
    subscriptions = list(get_field(listing, 'data') or [])
    if not subscriptions:
        return row

    live = [sub for sub in subscriptions if get_field(sub, 'status') in _LIVE_STATUSES]
    candidates = live or subscriptions
    latest = max(candidates, key=lambda sub: get_field(sub, 'created', 0) or 0)
    return apply_stripe_subscription(row, latest)
