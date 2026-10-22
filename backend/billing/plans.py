"""The plan catalog — the single source of truth for pricing and limits.

Everything the app shows (pricing page, sidebar card, billing tab) comes from
this module, either through ``GET /api/billing/plans`` or from a Subscription
row whose ``plan`` id points back here. Prices are in US cents so nothing is
lost to float rounding. Yearly is ``monthly * 12 * 0.8`` ("Save 20%").

Stripe price ids live in the environment, never in the database:
``price_id_for(plan, interval)`` translates a catalog entry into the id that
Stripe Checkout needs, and ``plan_for_price_id`` does the reverse for webhooks.
"""
from __future__ import annotations

from django.conf import settings

Interval = str  # 'month' | 'year'

PLAN_IDS = ('starter', 'pro', 'enterprise')
INTERVALS = ('month', 'year')

PLANS: list[dict] = [
    {
        'id': 'starter',
        'name': 'Starter',
        'tagline': 'For freelancers getting started with AI-powered social.',
        'monthlyCents': 2900,
        'yearlyCents': 27840,
        'popular': False,
        'limits': {
            'workspaces': 1,
            'postsPerMonth': 50,
            'credits': 1000,
            'platforms': 2,
            'seats': 1,
        },
        'features': [
            {'label': '1 workspace', 'included': True},
            {'label': '50 AI-generated posts/mo', 'included': True},
            {'label': '2 social platforms', 'included': True},
            {'label': '1,000 AI credits', 'included': True},
            {'label': 'Basic analytics', 'included': True},
            {'label': 'Email support', 'included': True},
            {'label': 'Brand memory', 'included': False},
            {'label': 'Team collaboration', 'included': False},
            {'label': 'Custom AI training', 'included': False},
            {'label': 'API access', 'included': False},
        ],
    },
    {
        'id': 'pro',
        'name': 'Pro',
        'tagline': 'For growing teams that need serious automation.',
        'monthlyCents': 7900,
        'yearlyCents': 75840,
        'popular': True,
        'limits': {
            'workspaces': 5,
            'postsPerMonth': 200,
            'credits': 10000,
            # None = unlimited / all.
            'platforms': None,
            'seats': 3,
        },
        'features': [
            {'label': '5 workspaces', 'included': True},
            {'label': '200 AI-generated posts/mo', 'included': True},
            {'label': 'All social platforms', 'included': True},
            {'label': '10,000 AI credits', 'included': True},
            {'label': 'Advanced analytics', 'included': True},
            {'label': 'Priority support', 'included': True},
            {'label': 'Brand memory & tone', 'included': True},
            {'label': 'Team collaboration (3 seats)', 'included': True},
            {'label': 'Custom AI training', 'included': False},
            {'label': 'API access', 'included': False},
        ],
    },
    {
        'id': 'enterprise',
        'name': 'Enterprise',
        'tagline': 'For agencies and brands at scale. Unlimited everything.',
        'monthlyCents': 19900,
        'yearlyCents': 191040,
        'popular': False,
        'limits': {
            'workspaces': None,
            'postsPerMonth': None,
            'credits': None,
            'platforms': None,
            'seats': None,
        },
        'features': [
            {'label': 'Unlimited workspaces', 'included': True},
            {'label': 'Unlimited AI posts', 'included': True},
            {'label': 'All social platforms', 'included': True},
            {'label': 'Unlimited AI credits', 'included': True},
            {'label': 'Custom analytics & reports', 'included': True},
            {'label': 'Dedicated account manager', 'included': True},
            {'label': 'Brand memory & tone', 'included': True},
            {'label': 'Unlimited team seats', 'included': True},
            {'label': 'Custom AI model training', 'included': True},
            {'label': 'Full API access & webhooks', 'included': True},
        ],
    },
]

PLANS_BY_ID: dict[str, dict] = {plan['id']: plan for plan in PLANS}

# (plan, interval) -> settings name holding the Stripe price id.
PRICE_ENV_NAMES: dict[tuple[str, str], str] = {
    ('starter', 'month'): 'STRIPE_PRICE_STARTER_MONTHLY',
    ('starter', 'year'): 'STRIPE_PRICE_STARTER_YEARLY',
    ('pro', 'month'): 'STRIPE_PRICE_PRO_MONTHLY',
    ('pro', 'year'): 'STRIPE_PRICE_PRO_YEARLY',
    ('enterprise', 'month'): 'STRIPE_PRICE_ENTERPRISE_MONTHLY',
    ('enterprise', 'year'): 'STRIPE_PRICE_ENTERPRISE_YEARLY',
}

UNLIMITED_LIMITS: dict[str, None] = {
    'workspaces': None,
    'postsPerMonth': None,
    'credits': None,
    'platforms': None,
    'seats': None,
}

# Limits reported to a user with no plan at all.
NO_PLAN_LIMITS: dict[str, int] = {
    'workspaces': 0,
    'postsPerMonth': 0,
    'credits': 0,
    'platforms': 0,
    'seats': 0,
}


def get_plan(plan_id: str) -> dict | None:
    """The catalog entry for ``plan_id``, or None when it isn't a real plan."""
    return PLANS_BY_ID.get(plan_id)


def price_id_for(plan: str, interval: str) -> str | None:
    """Stripe price id configured for ``plan``/``interval``, or None.

    None means either the pair is invalid or the environment has not been
    filled in yet (see docs/BILLING_SETUP.md).
    """
    name = PRICE_ENV_NAMES.get((plan, interval))
    if not name:
        return None
    value = (getattr(settings, name, '') or '').strip()
    return value or None


def plan_for_price_id(price_id: str) -> tuple[str, str] | None:
    """Reverse lookup: Stripe price id -> ``(plan, interval)``, or None."""
    if not price_id:
        return None
    for (plan, interval), name in PRICE_ENV_NAMES.items():
        value = (getattr(settings, name, '') or '').strip()
        if value and value == price_id:
            return plan, interval
    return None


def serialize_plan(plan: dict) -> dict:
    """Public shape of a plan. Stripe price ids are never exposed."""
    return {
        'id': plan['id'],
        'name': plan['name'],
        'tagline': plan['tagline'],
        'monthlyCents': plan['monthlyCents'],
        'yearlyCents': plan['yearlyCents'],
        'popular': plan['popular'],
        'limits': dict(plan['limits']),
        'features': [dict(feature) for feature in plan['features']],
    }


def limits_for_plan(plan_id: str) -> dict:
    """Limits of ``plan_id``; all-zero limits for the 'none' plan."""
    plan = get_plan(plan_id)
    if plan is None:
        return dict(NO_PLAN_LIMITS)
    return dict(plan['limits'])


# Model choices (imported by billing.models).
PLAN_CHOICES = [('none', 'No plan')] + [(plan_id, PLANS_BY_ID[plan_id]['name']) for plan_id in PLAN_IDS]
INTERVAL_CHOICES = [('month', 'Monthly'), ('year', 'Yearly')]
