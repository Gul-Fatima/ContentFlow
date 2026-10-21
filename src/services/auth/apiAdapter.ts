import {
  AuthError,
  type AuthAdapter,
  type Session,
  type SignInInput,
  type SignUpInput,
  type User,
} from './types';

/**
 * Adapter for the Django REST backend in `backend/`.
 *
 * Verified endpoints (backend/apps/core/urls.py):
 *   POST {base}/auth/register/  {username, password, email?} -> 201 {token, username}
 *   POST {base}/auth/token/     {username, password}         -> 200 {token}
 *
 * Notes:
 *  - The backend authenticates by `username`; the app treats the email address
 *    as the username (see docs/AUTH_CONTRACT.md).
 *  - DRF's token view answers 400 for bad credentials, so both 400 and 401 map
 *    to INVALID_CREDENTIALS.
 *  - The backend does not store a display name, and has no logout, /me or
 *    password-reset endpoint yet (TODOs below).
 */
const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/+$/, '');
const TIMEOUT_MS = 15_000;

function baseUrl(): string {
  if (!BASE_URL) {
    throw new AuthError('NOT_CONFIGURED', 'EXPO_PUBLIC_API_URL is not set.');
  }
  return BASE_URL;
}

interface RawResponse {
  status: number;
  body: Record<string, unknown> | null;
}

async function postJson(
  path: string,
  payload: Record<string, unknown>
): Promise<RawResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl()}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    let body: Record<string, unknown> | null = null;
    try {
      body = (await response.json()) as Record<string, unknown>;
    } catch {
      body = null;
    }
    return { status: response.status, body };
  } catch (error) {
    if (error instanceof AuthError) throw error;
    // AbortError, DNS failure, CORS rejection, offline: all NETWORK for the UI.
    throw new AuthError('NETWORK', 'Network request failed.');
  } finally {
    clearTimeout(timer);
  }
}

export const apiAdapter: AuthAdapter = {
  async signUp({ name, email, password }: SignUpInput): Promise<Session> {
    const normalized = email.trim().toLowerCase();
    const { status, body } = await postJson('/auth/register/', {
      username: normalized,
      email: normalized,
      password,
    });

    if (status === 201 && typeof body?.token === 'string') {
      const username =
        typeof body.username === 'string' ? body.username : normalized;
      const user: User = {
        // The API returns no numeric id; the username is the stable identifier.
        id: username,
        // Not persisted server-side yet — keep what the user typed for display.
        name: name.trim() || username,
        email: normalized,
      };
      return { user, token: body.token };
    }

    if (status === 409) throw new AuthError('EMAIL_TAKEN');
    if (status === 400) {
      const detail = JSON.stringify(body ?? {}).toLowerCase();
      if (detail.includes('taken') || detail.includes('already')) {
        throw new AuthError('EMAIL_TAKEN');
      }
      throw new AuthError('UNKNOWN', 'Registration was rejected by the server.');
    }
    throw new AuthError('UNKNOWN', `Unexpected status ${status}.`);
  },

  async signIn({ email, password }: SignInInput): Promise<Session> {
    const normalized = email.trim().toLowerCase();
    const { status, body } = await postJson('/auth/token/', {
      username: normalized,
      password,
    });

    if (status === 200 && typeof body?.token === 'string') {
      const user: User = { id: normalized, name: normalized, email: normalized };
      return { user, token: body.token };
    }

    if (status === 400 || status === 401) throw new AuthError('INVALID_CREDENTIALS');
    if (status === 409) throw new AuthError('EMAIL_TAKEN');
    throw new AuthError('UNKNOWN', `Unexpected status ${status}.`);
  },

  async signOut(): Promise<void> {
    // TODO(auth-contract): POST /auth/logout/ once the backend can revoke the
    // DRF token. Until then sign-out is local-only (token discarded client-side)
    // and the old token stays valid server-side.
    baseUrl();
  },

  async requestPasswordReset(): Promise<{ sent: boolean; demo?: boolean }> {
    baseUrl();
    // TODO(auth-contract): POST /auth/password-reset/ {email} -> {sent: true}.
    // Not implemented because the backend has no such endpoint yet; never claim
    // an email was sent.
    throw new AuthError(
      'NOT_CONFIGURED',
      'Password reset is not available yet.'
    );
  },
};

/** Exported for docs/tests: the API base URL the adapter resolved. */
export const API_BASE_URL = BASE_URL;
