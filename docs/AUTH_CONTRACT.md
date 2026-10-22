# Auth contract — **Implemented**

The Expo app (`src/services/auth/`) talks to the Django backend through one
adapter. This document is the contract for `EXPO_PUBLIC_AUTH_MODE=api`.

Implemented in `backend/accounts/` and mounted under `/api/`. All payloads are
JSON with **camelCase** keys; all errors use one envelope:

```json
{ "code": "VALIDATION", "message": "Please check the highlighted fields.",
  "fields": { "email": ["Enter a valid email address."] } }
```

`fields` is only present for `VALIDATION` errors. `message` is safe to show to
the user; internal details are never leaked.

## `POST /api/auth/register`

Request:

```json
{ "name": "Alex Morgan", "email": "alex@company.com", "password": "correct horse" }
```

Success `201`:

```json
{
  "user": {
    "id": "0b7f3e2c-...",
    "name": "Alex Morgan",
    "email": "alex@company.com",
    "role": "",
    "company": "",
    "avatarUrl": ""
  },
  "token": "opaque-token"
}
```

Errors:
- `400` `VALIDATION` — field messages (`name`, `email`, `password`). Passwords
  are validated with Django's password validators (minimum 8 characters).
- `409` `EMAIL_TAKEN` — `{ "code": "EMAIL_TAKEN", "message": "An account with this email already exists." }`
- `429` `RATE_LIMITED`

## `POST /api/auth/login`

Request:

```json
{ "email": "alex@company.com", "password": "correct horse" }
```

Success `200`: same `{ user, token }` shape as register.

Errors:
- `401` `INVALID_CREDENTIALS` — identical response for an unknown email, a
  wrong password and an inactive account:
  `{ "code": "INVALID_CREDENTIALS", "message": "Incorrect email or password." }`
- `400` `VALIDATION` — malformed request
- `429` `RATE_LIMITED`

## `POST /api/auth/logout`

Authenticated call (`Authorization: Token <key>`), empty body.

Success `204`, no body. The token row is deleted, so the token stops working.

## `GET /api/auth/me`

Authenticated call.

Success `200`:

```json
{ "user": { "id": "0b7f3e2c-...", "name": "Alex Morgan", "email": "alex@company.com", "role": "", "company": "", "avatarUrl": "" } }
```

Errors: `401` `UNAUTHENTICATED` when the token is missing, invalid or revoked.
The client calls this once after restoring a session; a `401` clears the stored
session.

## `POST /api/auth/password-reset`

Request:

```json
{ "email": "alex@company.com" }
```

Success `200` — **always**, whether or not the account exists:

```json
{ "sent": true }
```

If an active user matches, the backend emails a link built with Django's
`default_token_generator`:

```
{FRONTEND_URL}/reset-password?uid=<urlsafe-b64-user-id>&token=<token>
```

The reset-confirm screen/endpoint is not implemented yet.

Malformed input is ignored, so the response is `200 { "sent": true }` for any
body that is not throttled — the endpoint reveals nothing about accounts.
Errors: `429` `RATE_LIMITED` only.

## Header and throttling

- Protected endpoints require `Authorization: Token <key>`.
- Register, login and password-reset share the DRF `auth` throttle scope:
  **10 requests/minute per client**. Exceeding it returns `429`:

```json
{ "code": "RATE_LIMITED", "message": "Too many attempts. Try again in a minute." }
```

## Error codes the client understands

| Code | Meaning |
|---|---|
| `VALIDATION` | `400`, per-field messages in `fields` |
| `EMAIL_TAKEN` | `409`, email already registered |
| `INVALID_CREDENTIALS` | `401` on login |
| `UNAUTHENTICATED` | `401` on `/me` or logout: session no longer valid |
| `RATE_LIMITED` | `429`, throttled |
| `UNKNOWN` | Anything else; generic message only |

Client-side only (never returned by the API): `NETWORK` (offline, CORS or the
15 s client timeout) and `NOT_CONFIGURED` (missing `EXPO_PUBLIC_API_URL`).

## Client behaviour worth knowing

- Sessions are stored with `expo-secure-store` (Keychain/Keystore). Web falls
  back to `localStorage`, which is **not** a trusted keystore — treat web
  sessions as revocable and short-lived.
- `remember: false` keeps the session in memory only; it is lost on restart.
- `signOut()` calls `POST /auth/logout`, but always clears the local session
  even when the call fails (offline or already-invalid token).
- Demo mode (`EXPO_PUBLIC_AUTH_MODE=mock`, or no `EXPO_PUBLIC_API_URL`) stores
  accounts in AsyncStorage with a salted SHA-256 digest of the password. It is a
  development convenience, not a security boundary, and must never be enabled
  for a production build.
- No password or password hash is ever sent anywhere except the register/login
  request body itself.
