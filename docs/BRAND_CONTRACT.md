# Brand profile API contract

The onboarding client stores brand profiles locally while running in mock mode.
For API mode, the backend should provide the following authenticated endpoints.

## `PUT /brand-profile`

Request JSON:

```json
{
  "brandName": "Acme Corp",
  "industry": "Technology / SaaS",
  "website": "https://acme.com",
  "purpose": "We help small businesses grow their audience with practical tools.",
  "goals": ["awareness", "leads"]
}
```

Success: `200` with the saved profile in the same shape as the request.

## `GET /brand-profile`

Returns the authenticated user's profile in the same shape. If no profile
exists yet, return `404`.

## Validation

- `brandName`: required, 2-80 characters.
- `industry`: required; one of the fixed industries presented by the client.
- `website`: optional; when present it must be a valid absolute URL.
- `purpose`: required, 10-500 characters.
- `goals`: optional array containing only `awareness`, `sales`, `leads`,
  `engagement`, `community`, and `leadership`.

Requests use the application's configured authenticated user session. Do not
accept a user ID from the request body to select whose profile is read or
written.
