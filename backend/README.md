# Backend (Django + DRF)

API for the Ibda' Expo app. Auth endpoints live in `accounts/`, Stripe billing
in `billing/` (hosted Checkout + Billing Portal, webhook-driven), the rest of
the demo API in `apps/core/`.

## First run

```bash
cp backend/.env.example backend/.env      # fill in SECRET_KEY, POSTGRES_*, ...
docker compose up --build                 # db + backend on http://localhost:8000
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

The container already runs `migrate` on boot; running it again is harmless.
Then start the app with `npx expo start` and point `EXPO_PUBLIC_API_URL` at
`http://localhost:8000/api` (see the root `.env.example`).

Health check: `GET http://localhost:8000/api/health` → `{"status": "ok"}`.

## Environment variables (`backend/.env`)

| Variable | Purpose |
|---|---|
| `DEBUG` | `True` for local development (default `False`) |
| `SECRET_KEY` | Required whenever `DEBUG=False` |
| `ALLOWED_HOSTS` | Comma-separated hosts, e.g. `localhost,127.0.0.1` |
| `POSTGRES_DB` | Database name |
| `POSTGRES_USER` | Database user |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_HOST` | Set to `db` by docker-compose; empty = local SQLite |
| `POSTGRES_PORT` | Database port (default `5432`) |
| `DATABASE_URL` | Optional full URL, used only when `POSTGRES_HOST` is empty |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins (`http://localhost:8081`) |
| `EMAIL_BACKEND` | Defaults to the console backend when `DEBUG=True` |
| `DEFAULT_FROM_EMAIL` | Sender for password-reset emails |
| `FRONTEND_URL` | Base URL used to build reset links and billing return URLs (default `http://localhost:8081`) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_…`). Empty = billing disabled, endpoints answer `503 PAYMENTS_NOT_CONFIGURED` |
| `STRIPE_WEBHOOK_SECRET` | Signing secret of the webhook endpoint (`whsec_…`) |
| `STRIPE_PRICE_<PLAN>_<INTERVAL>` | The six price ids: `STRIPE_PRICE_STARTER_MONTHLY`, `…_STARTER_YEARLY`, `…_PRO_MONTHLY`, `…_PRO_YEARLY`, `…_ENTERPRISE_MONTHLY`, `…_ENTERPRISE_YEARLY` |
| `PUBLIC_API_ORIGIN` | Public origin of this API, used in Stripe success/cancel URLs (default `http://localhost:8000`) |
| `APP_SCHEME` | Deep-link scheme from `app.json` (`agentai`), allowed as a billing return URL |

`GEMINI_API_KEY` and the `GEMINI_*` model names configure the optional AI
features in `apps/core`.

## Auth notes

- `AUTH_USER_MODEL = 'accounts.User'`: email login, UUID primary key, no
  username. Emails are stored lowercased with a case-insensitive unique
  constraint.
- Tokens come from `rest_framework.authtoken`; send `Authorization: Token <key>`.
- Register, login and password reset are throttled at `10/min`.
- See `docs/AUTH_CONTRACT.md` for request/response shapes and error codes.

## Billing notes

- Plans, prices and limits live in `billing/plans.py`; Stripe price ids come
  only from the environment. Yearly is `monthly × 12 × 0.8`.
- New subscriptions are created **only** through Stripe-hosted Checkout, and
  changed **only** through the Stripe Billing Portal. The server never sees
  card data.
- `GET /api/billing/subscription?refresh=1` and the webhook share one sync
  function, so the UI cannot drift from Stripe.
- The webhook verifies the raw body signature and stores processed event ids
  for idempotency. It needs the Stripe CLI locally:
  `stripe listen --forward-to localhost:8000/api/billing/webhook`.
- Full setup (products, prices, env vars, portal settings, going live):
  **`docs/BILLING_SETUP.md`**. Endpoint shapes: `docs/BILLING_CONTRACT.md`.

If you migrated a development database before the custom user model existed,
reset it once: `docker compose down -v` (deletes the Postgres volume), then
`docker compose up --build`.
