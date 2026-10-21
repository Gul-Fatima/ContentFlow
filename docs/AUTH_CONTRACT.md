# Auth contract

The client (`src/services/auth/`) talks to the backend through one adapter. This
document is the contract the backend must satisfy for
`EXPO_PUBLIC_AUTH_MODE=api` to work end to end.

## Current state of the backend

Implemented today in `backend/apps/core/urls.py` (Django REST Framework):

| Endpoint | Request | Success | Failure |
|---|---|---|---|
| `POST /api/auth/register/` | `{username, password, email?}` | `201 {token, username}` | `400 {error: "username already taken"}` |
| `POST /api/auth/token/` | `{username, password}` | `200 {token}` | `400 {non_field_errors: [...]}` |

Auth header for protected calls: `Authorization: Token <key>`.
The backend authenticates by **username**; the app sends the email address as
the username. There is **no** logout, `/me` or password-reset endpoint yet, so
`apiAdapter.signOut()` is local-only and `apiAdapter.requestPasswordReset()`
throws `NOT_CONFIGURED`.

## Target contract

The shapes below are what the client expects once the endpoints land. The
`apiAdapter` already parses `user + token` responses, so a backend returning
this contract needs no client changes.

### `POST /auth/register`

Request:

```json
{ "name": "Alex Morgan", "email": "alex@company.com", "password": "correct horse" }
```

Success `201`:

```json
{
  "user": { "id": "u_123", "name": "Alex Morgan", "email": "alex@company.com" },
  "token": "opaque-session-token"
}
```

Errors:
- `400` validation problem (`{"error": "password too short"}`)
- `409` email already registered (`{"error": "email already registered"}`)

### `POST /auth/login`

Request:

```json
{ "email": "alex@company.com", "password": "correct horse" }
```

Success `200`: same `{user, token}` shape as register.

Errors:
- `401` bad credentials → shown as “Incorrect email or password.”
- `400` malformed request

### `POST /auth/logout`

Request: authenticated call (`Authorization: Token <key>`), empty body.

Success `204`. The server must invalidate the token. Until this exists the
client discards the token locally only, so a stolen token stays valid.

### `GET /auth/me`

Request: authenticated call.

Success `200`:

```json
{ "id": "u_123", "name": "Alex Morgan", "email": "alex@company.com" }
```

Errors: `401` when the token is expired or revoked. The client currently
restores sessions from secure storage and does not call `/me`; wire it in when
token expiry matters.

### `POST /auth/password-reset`

Request:

```json
{ "email": "alex@company.com" }
```

Success `202 { "sent": true }`. Always answer success for unknown emails so the
endpoint cannot be used to enumerate accounts. The client never claims an email
was sent unless the backend says so.

Errors: `400` malformed request, `429` rate limited.

## Client behaviour worth knowing

- Sessions are stored with `expo-secure-store` (Keychain/Keystore). Web falls
  back to `localStorage`, which is **not** a trusted keystore — treat web
  sessions as revocable and short-lived.
- `remember: false` keeps the session in memory only; it is lost on restart.
- Demo mode (`EXPO_PUBLIC_AUTH_MODE=mock`) stores accounts in AsyncStorage with
  a salted SHA-256 digest of the password. It is a development convenience, not
  a security boundary, and it must never be enabled for a production build.
- No password or password hash is ever sent anywhere except the register/login
  request body itself.
