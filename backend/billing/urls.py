"""Billing routes, mounted at ``/api/billing/``.

No trailing slashes, matching the auth endpoints (clients send exact paths and
Stripe's configured webhook URL has none either).
"""
from django.urls import path

from billing import views

urlpatterns = [
    path('plans', views.PlansView.as_view(), name='billing-plans'),
    path('subscription', views.SubscriptionView.as_view(), name='billing-subscription'),
    path('checkout', views.CheckoutView.as_view(), name='billing-checkout'),
    path('return', views.ReturnView.as_view(), name='billing-return'),
    path('portal', views.PortalView.as_view(), name='billing-portal'),
    path('invoices', views.InvoicesView.as_view(), name='billing-invoices'),
    path('webhook', views.WebhookView.as_view(), name='billing-webhook'),
]
