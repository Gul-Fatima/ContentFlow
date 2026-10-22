"""The one place a Stripe client is built.

Uses the ``StripeClient`` namespace API introduced in stripe-python 7 and made
the primary surface in 16 (``client.v1.*``). Keeping every Stripe object here
means a package upgrade is a one-file change.
"""
from functools import lru_cache

import stripe
from django.conf import settings

from billing.exceptions import PaymentsNotConfigured


def secret_key() -> str:
    return (getattr(settings, 'STRIPE_SECRET_KEY', '') or '').strip()


def payments_configured() -> bool:
    """True when billing endpoints can talk to Stripe at all."""
    return bool(secret_key())


@lru_cache(maxsize=4)
def _client_for(key: str) -> stripe.StripeClient:
    return stripe.StripeClient(key)


def get_stripe_client() -> stripe.StripeClient:
    """A configured client, or ``PaymentsNotConfigured`` (503) when no key."""
    key = secret_key()
    if not key:
        raise PaymentsNotConfigured()
    return _client_for(key)


class WebhookVerificationError(Exception):
    """The webhook body did not match ``STRIPE_WEBHOOK_SECRET``."""


def construct_webhook_event(payload: bytes, signature: str):
    """Verify a webhook signature and return the Stripe event."""
    secret = (getattr(settings, 'STRIPE_WEBHOOK_SECRET', '') or '').strip()
    if not secret:
        raise PaymentsNotConfigured()
    try:
        return stripe.Webhook.construct_event(payload, signature, secret)
    except (ValueError, stripe.SignatureVerificationError) as exc:
        raise WebhookVerificationError(str(exc)) from exc
