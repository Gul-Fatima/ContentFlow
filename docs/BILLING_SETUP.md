# Billing setup (Stripe, test mode)

Pro upgrades use **Stripe-hosted Checkout** for new subscriptions and the
**Stripe Billing Portal** for every later change (payment method, cancel,
switch plan). Card data is entered on Stripe's pages only — the app and the
API never see it.

The backend stays up with no Stripe configuration: billing endpoints that need
Stripe answer `503 {"code":"PAYMENTS_NOT_CONFIGURED"}`.

---

## 1. Create the products and prices

In the Stripe Dashboard, with **Test mode** switched on:

1. **Products → Add product** three times, with these exact names:

   | Product | Monthly | Yearly (`monthly × 12 × 0.8`) |
   |---|---|---|
   | `Starter` | `$29.00` / month | `$278.40` / year |
   | `Pro` | `$79.00` / month | `$758.40` / year |
   | `Enterprise` | `$199.00` / month | `$1,910.40` / year |

2. For each product add **two recurring prices**: one with billing period
   *monthly* and one *yearly*. Currency **USD**.
3. Copy each price's id (`price_...`, not the product id `prod_...`) into
   `backend/.env`:

   ```dotenv
   STRIPE_PRICE_STARTER_MONTHLY=price_...
   STRIPE_PRICE_STARTER_YEARLY=price_...
   STRIPE_PRICE_PRO_MONTHLY=price_...
   STRIPE_PRICE_PRO_YEARLY=price_...
   STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...
   STRIPE_PRICE_ENTERPRISE_YEARLY=price_...
   ```

The catalog itself (names, taglines, features, limits, prices in cents) lives
in `backend/billing/plans.py`; the Stripe prices above must match it. Amounts
shown in the app come from `plans.py`, so a mismatch shows a different price
than Stripe charges — double-check both monthly and yearly.

## 2. API keys

1. **Developers → API keys → Secret key** (`sk_test_...`) →
   `STRIPE_SECRET_KEY`.
2. `PUBLIC_API_ORIGIN` must be an origin Stripe can redirect the customer's
   browser to — `http://localhost:8000` for a browser on the same machine.
   A phone cannot resolve `localhost`, so use your machine's LAN origin, e.g.
   `http://192.168.1.20:8000`.
3. `FRONTEND_URL` (already used by auth) is the web app origin, e.g.
   `http://localhost:8081`.
4. `APP_SCHEME` is `app.json → expo.scheme` (`agentai`). Return URLs starting
   with `agentai://` are allowed so native checkouts come back into the app;
   `exp://` is allowed only while `DEBUG=True`.

Allowed return URLs are an allowlist: `FRONTEND_URL` (exact or a subpath) or
`<APP_SCHEME>://`. Anything else is rejected with `400 VALIDATION`, and
`/api/billing/return` falls back to `FRONTEND_URL` instead of redirecting
somewhere unknown.

## 3. Webhook locally

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli), log in with
`stripe login`, then forward events to the running API:

```bash
stripe listen --forward-to localhost:8000/api/billing/webhook
```

The CLI prints a signing secret:

```
> Ready! Your webhook signing secret is whsec_abc123...
```

Copy the **whole** `whsec_...` value into `STRIPE_WEBHOOK_SECRET` and restart
the backend. The endpoint verifies the signature over the raw body; an invalid
signature is a `400`, and duplicate event ids are acknowledged with `200`
without being processed twice.

## 4. Webhook events in production

In **Developers → Webhooks → Add endpoint**, use
`https://<your-api-domain>/api/billing/webhook` and enable exactly:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

Then copy that endpoint's signing secret into `STRIPE_WEBHOOK_SECRET`.
Other event types are ignored with a `200`.

## 5. Enable the Customer Portal

**Settings → Billing → Customer portal**:

- **Payment methods**: allow customers to update payment methods.
- **Cancellations**: allow cancellation, at end of billing period.
- **Subscriptions**: allow customers to switch plans (add all six prices to the
  portal's product list, otherwise "Switch plan" is empty).
- Save. There is no code change when you edit these settings.

Plan switches happen **only** in the portal, so a customer can never end up
with two subscriptions.

## 6. How the app decides what to show

- The pricing page, sidebar card and profile Billing tab read
  `GET /api/billing/subscription`.
- After Checkout the success screen **polls** that endpoint with `?refresh=1`
  for up to 30 seconds. It shows "You're on the {Plan} plan" only when the
  backend reports an active subscription — never because of the URL or the
  redirect itself.
- `?refresh=1` asks Stripe directly (server-side lookup) when the user has a
  customer id, so a delayed webhook does not block the UI.
- Renewal failures arrive as `invoice.payment_failed` → status `past_due`, shown
  as a banner with "Update payment method" (opens the portal).

## 7. Going live

1. Recreate the same three products and six prices in **live mode** and set the
   six `STRIPE_PRICE_*` variables to the live price ids.
2. Swap `STRIPE_SECRET_KEY` for the live key and add a live webhook endpoint
   with its own `whsec_...`.
3. `PUBLIC_API_ORIGIN` and `FRONTEND_URL` must be public HTTPS origins;
   `DEBUG=False` (then `exp://` is not allowed as a return URL).
4. Only do this after a full test-mode review (successful payment, renewal
   failure, cancel, plan switch).

## 8. Data stored

`billing.Subscription` holds the user, plan id, interval, Stripe customer and
subscription ids, status, period end, `cancel_at_period_end` and usage
counters — no card data, no addresses, no receipts. `billing.WebhookEvent`
stores processed event ids so retries are idempotent. Both are registered in the
Django admin, read-only.
