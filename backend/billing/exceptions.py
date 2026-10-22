"""Billing-specific API errors.

They carry ``api_code`` so the shared exception handler in
``accounts.exceptions`` can return the project's uniform envelope
``{"code", "message", "fields"?}`` without importing this app.
"""
from rest_framework import status
from rest_framework.exceptions import APIException


class PaymentsNotConfigured(APIException):
    """Stripe keys are not set — the feature is unavailable, not broken."""

    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_detail = "Payments aren't set up yet."
    default_code = 'payments_not_configured'
    api_code = 'PAYMENTS_NOT_CONFIGURED'


class AlreadySubscribed(APIException):
    status_code = status.HTTP_409_CONFLICT
    default_detail = 'You already have an active plan. Use Manage billing to change it.'
    default_code = 'already_subscribed'
    api_code = 'ALREADY_SUBSCRIBED'


class NoBillingAccount(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'No billing account yet. Choose a plan first.'
    default_code = 'no_billing_account'
    api_code = 'NO_BILLING_ACCOUNT'


class PaymentProviderError(APIException):
    """Stripe answered with an error we can't act on (bad price id, outage)."""

    status_code = status.HTTP_502_BAD_GATEWAY
    default_detail = "We couldn't reach the payment provider. Please try again."
    default_code = 'payment_provider_error'
    api_code = 'PAYMENTS_ERROR'
