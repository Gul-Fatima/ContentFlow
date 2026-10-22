"""Admin views for billing state.

Everything mirrored from Stripe is read-only here: editing a plan by hand would
desynchronise the database from what the customer is actually paying for. Use
the Stripe Dashboard or the Billing Portal to change a subscription.
"""
from django.contrib import admin

from billing.models import Subscription, WebhookEvent


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'plan',
        'interval',
        'status',
        'cancel_at_period_end',
        'current_period_end',
        'updated_at',
    )
    list_filter = ('plan', 'interval', 'status', 'cancel_at_period_end')
    search_fields = ('user__email', 'stripe_customer_id', 'stripe_subscription_id')
    readonly_fields = (
        'plan',
        'interval',
        'status',
        'stripe_customer_id',
        'stripe_subscription_id',
        'current_period_end',
        'cancel_at_period_end',
        'created_at',
        'updated_at',
    )

    def has_add_permission(self, request):
        # Rows are created by checkout/webhooks, never by hand.
        return False


@admin.register(WebhookEvent)
class WebhookEventAdmin(admin.ModelAdmin):
    list_display = ('event_id', 'type', 'received_at')
    list_filter = ('type',)
    search_fields = ('event_id',)
    readonly_fields = ('event_id', 'type', 'received_at')

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
