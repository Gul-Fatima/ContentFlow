"""Billing state mirrored from Stripe.

Nothing here ever holds payment instrument data: Checkout and the Billing
Portal are hosted by Stripe, so the server only stores ids, plan identity and
the subscription lifecycle fields it needs to gate features.
"""
from django.conf import settings
from django.db import models

from billing.plans import INTERVAL_CHOICES, PLAN_CHOICES

ACTIVE_STATUSES = ('active', 'trialing')


class Subscription(models.Model):
    """One per user. Absent row == no plan, which the API reports as 'none'."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='subscription',
    )
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='none')
    interval = models.CharField(max_length=10, choices=INTERVAL_CHOICES, blank=True)
    # Raw Stripe subscription status ('active', 'trialing', 'past_due', ...).
    status = models.CharField(max_length=32, default='none')
    stripe_customer_id = models.CharField(max_length=255, blank=True, db_index=True)
    stripe_subscription_id = models.CharField(max_length=255, blank=True, db_index=True)
    current_period_end = models.DateTimeField(null=True, blank=True)
    cancel_at_period_end = models.BooleanField(default=False)
    # Usage counters are incremented by AI generation (later task).
    posts_used = models.PositiveIntegerField(default=0)
    credits_used = models.PositiveIntegerField(default=0)
    usage_period_start = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Subscription'
        verbose_name_plural = 'Subscriptions'

    def __str__(self) -> str:
        return f'{self.user_id} · {self.plan} ({self.status})'

    @property
    def is_active(self) -> bool:
        return self.status in ACTIVE_STATUSES and self.plan != 'none'


class WebhookEvent(models.Model):
    """Processed Stripe event ids — makes webhook handling idempotent."""

    event_id = models.CharField(max_length=255, unique=True)
    type = models.CharField(max_length=120)
    received_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Webhook event'
        verbose_name_plural = 'Webhook events'
        ordering = ('-received_at',)

    def __str__(self) -> str:
        return f'{self.type} · {self.event_id}'
