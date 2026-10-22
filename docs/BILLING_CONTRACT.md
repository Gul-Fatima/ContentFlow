# Billing API contract

**Status: Implemented** (`backend/billing/`, client `src/services/billing/`).

All endpoints are JSON, camelCase, under `/api/billing/`. Every one of them
uses the project error envelope:

```json
{ "code": "VALIDATION", "message": "…", "fields": { "plan": ["…"] } }
```

`fields` is optional. Auth is `Authorization: Token <key>` (DRF authtoken);
`IsAuthenticated` applies to everything except the catalog, the return
redirect and the webhook.

Card data never reaches this API. The server returns Stripe-hosted URLs and
the app only opens them.

---

## GET /api/billing/plans — public

No auth, no throttling. Prices are the catalog in `backend/billing/plans.py`;
Stripe price ids are **not** exposed.

```json
{
  "plans": [
    {
      "id": "starter",
      "name": "Starter",
      "tagline": "For freelancers getting started with AI-powered social.",
      "monthlyCents": 2900,
      "yearlyCents": 27840,
      "popular": false,
      "limits": {
        "workspaces": 1,
        "postsPerMonth": 50,
        "credits": 1000,
        "platforms": 2,
        "seats": 1
      },
      "features": [
        { "label": "1 workspace", "included": true },
        { "label": "Brand memory", "included": false }
      ]
    }
  ]
}
```

Plans are always returned in the order Starter, Pro, Enterprise. `null` in
`limits` means unlimited / all.

## GET /api/billing/subscription — auth

A user who never subscribed has no row; that is reported as plan `none`.

```json
{
  "subscription": {
    "plan": "pro",
    "interval": "month",
    "status": "active",
    "isActive": true,
    "currentPeriodEnd": "2026-11-22T09:00:00Z",
    "cancelAtPeriodEnd": false,
    "usage": {
      "postsUsed": 0,
      "postsLimit": 200,
      "creditsUsed": 0,
      "creditsLimit": 10000
    },
    "limits": {
      "workspaces": 5,
      "postsPerMonth": 200,
      "credits": 10000,
      "platforms": null,
      "seats": 3
    }
  }
}
```

- `plan`: `none | starter | pro | enterprise`
- `interval`: `month | year | null`
- `status`: the raw Stripe status, or `none`
- `isActive`: `status ∈ {active, trialing}` **and** `plan != none`
- `?refresh=1`: when the user has a Stripe customer id, the row is re-read
  from Stripe before responding (covers webhook delay). If Stripe keys are
  missing this returns `503 PAYMENTS_NOT_CONFIGURED`.

## POST /api/billing/checkout — auth, throttle `billing` (20/min)

```json
{ "plan": "pro", "interval": "month", "returnUrl": "http://localhost:8081" }
```

`returnUrl` is optional (default `FRONTEND_URL`). It must be an allowlisted
base: `FRONTEND_URL` exactly or a subpath of it, or `<APP_SCHEME>://…`, or
`exp://…` while `DEBUG=True`. Anything else is `400 VALIDATION`.

Response `200`:

```json
{ "url": "https://checkout.stripe.com/c/pay/cs_test_…" }
```

Behaviour: gets or creates the Stripe customer (email, name,
`metadata.user_id`) and stores its id, then creates a `mode=subscription`
Checkout Session with `client_reference_id = user.id`, metadata
`{user_id, plan, interval}` on the session **and** the subscription, the price
for `plan`/`interval`, `allow_promotion_codes: false`,
`billing_address_collection: auto`, and success/cancel URLs pointing at
`/api/billing/return` with the app's return base.

Errors:

| Status | Code | When |
|---|---|---|
| 400 | `VALIDATION` | unknown plan/interval `fields`; disallowed `returnUrl` |
| 409 | `ALREADY_SUBSCRIBED` | the caller already has an active subscription |
| 429 | `RATE_LIMITED` | more than 20 billing requests per minute |
| 502 | `PAYMENTS_ERROR` | Stripe rejected the request |
| 503 | `PAYMENTS_NOT_CONFIGURED` | `STRIPE_SECRET_KEY` or that price id is unset |

## GET /api/billing/return — public, no auth

Stripe's success/cancel redirect lands here and is bounced into the app:

- `?status=success&session_id=cs_…&to=<base>` → `302` to
  `<base>/billing/success?session_id=…`
- `?status=cancel&to=<base>` → `302` to `<base>/billing/cancel`
- invalid/missing `to` → `302` to `FRONTEND_URL`
- any other `status` → `302` to `FRONTEND_URL`

Only `status`, `session_id` and `to` are read; nothing is echoed. The
`session_id` is a diagnostic reference — it is never proof of payment.

## POST /api/billing/portal — auth, throttle `billing` (20/min)

```json
{ "returnUrl": "http://localhost:8081" }
```

`returnUrl` is optional; the default is `FRONTEND_URL/profile?tab=billing`.
A validated `returnUrl` without a query string gets `/profile?tab=billing`
appended.

```json
{ "url": "https://billing.stripe.com/p/session/…" }
```

Errors: `400 NO_BILLING_ACCOUNT` (no Stripe customer yet),
`400 VALIDATION` (disallowed `returnUrl`), `429 RATE_LIMITED`,
`502 PAYMENTS_ERROR`, `503 PAYMENTS_NOT_CONFIGURED`.

Plan changes happen **only** here (or in the Stripe Dashboard); the app never
creates a second subscription.

## GET /api/billing/invoices — auth

The last 12 invoices for the caller's Stripe customer, newest first.
No customer → `{"invoices": []}`.

```json
{
  "invoices": [
    {
      "id": "in_…",
      "number": "INV-0001",
      "amountCents": 7900,
      "currency": "usd",
      "status": "paid",
      "createdAt": "2026-10-22T09:00:00Z",
      "hostedInvoiceUrl": "https://invoice.stripe.com/i/…",
      "pdfUrl": "https://pay.stripe.com/invoice/…/pdf"
    }
  ]
}
```

`hostedInvoiceUrl` / `pdfUrl` are `null` when Stripe has none yet.

## POST /api/billing/webhook — public, no auth, no throttle

Raw-body signature verification against `STRIPE_WEBHOOK_SECRET`
(`Stripe-Signature` header). Invalid or missing signature → `400`. Stripe
keys unset → `503`. Duplicate `event_id` → `200` without reprocessing
(`billing.WebhookEvent`). Handled events:

| Event | Effect |
|---|---|
| `checkout.session.completed` | links customer + subscription ids from `client_reference_id`, then syncs from Stripe |
| `customer.subscription.created` / `.updated` | mirrors plan, interval, status, `cancelAtPeriodEnd`, `currentPeriodEnd` |
| `customer.subscription.deleted` | plan `none`, status `canceled` |
| `invoice.paid` / `invoice.payment_failed` | re-syncs from the subscription → `active` / `past_due` |

Unknown event types return `200` and are ignored. Unknown price ids are logged
and leave the plan unchanged. Logs contain event ids and types only — never
payloads.

---

## Error codes summary

| Code | Status | Meaning |
|---|---|---|
| `VALIDATION` | 400 | bad body/URL; see `fields` |
| `NO_BILLING_ACCOUNT` | 400 | portal/invoices need a Stripe customer first |
| `UNAUTHENTICATED` | 401 | missing/expired token |
| `ALREADY_SUBSCRIBED` | 409 | an active plan exists; use the portal |
| `RATE_LIMITED` | 429 | billing throttle hit |
| `PAYMENTS_ERROR` | 502 | Stripe rejected/failed the request |
| `PAYMENTS_NOT_CONFIGURED` | 503 | Stripe env vars unset or incomplete |
| `INVALID_SIGNATURE` | 400 | webhook body did not match the signing secret |
| `UNKNOWN` | 4xx/5xx | anything else; never contains internals |

## Client mapping (`src/services/billing/billingService.ts`)

`getPlans()`, `getSubscription({refresh})`, `startCheckout({plan, interval})`,
`openPortal()`, `listInvoices()`. Without `EXPO_PUBLIC_API_URL` every call
rejects with `ApiError` code `PAYMENTS_NOT_CONFIGURED` — the app never invents
a local plan. A `401 UNAUTHENTICATED` triggers the registered handler in
`AuthProvider` (sign out + `/welcome`).
