import {
  AuthError,
  type AuthAdapter,
  type AuthFieldErrors,
  type Session,
  type SignInInput,
  type SignUpInput,
  type User,
} from './types';

/**
 * Adapter for the Django REST backend in `backend/` (see docs/AUTH_CONTRACT.md).
 *
 *   POST {base}/auth/register        {name, email, password} -> 201 {user, token}
 *   POST {base}/auth/login           {email, password}       -> 200 {user, token}
 *   POST {base}/auth/logout          Token <key>             -> 204
 *   GET  {base}/auth/me              Token <key>             -> 200 {user}
 *   POST {base}/auth/password-reset  {email}                 -> 200 {sent: true}
 *
 * Errors are always `{code, message, fields?}`; this adapter turns them into
 * `AuthError`s the screens already know how to display.
 */
const BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? '').replace(/\/+$/, '');
const TIMEOUT_MS = 15_000;

type JsonBody = Record<string, unknown>;

interface RawResponse {
  status: number;
  body: JsonBody | null;
}

interface RequestOptions {
  method?: 'GET' | 'POST';
  payload?: Record<string, unknown>;
  token?: string;
}

function baseUrl(): string {
  if (!BASE_URL) {
    throw new AuthError('NOT_CONFIGURED', 'EXPO_PUBLIC_API_URL is not set.');
  }
  return BASE_URL;
}

async function request(
  path: string,
  { method = 'GET', payload, token }: RequestOptions = {}
): Promise<RawResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (payload !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Token ${token}`;

  try {
    const response = await fetch(`${baseUrl()}${path}`, {
      method,
      headers,
      body: payload === undefined ? undefined : JSON.stringify(payload),
      signal: controller.signal,
    });

    let body: JsonBody | null = null;
    if (response.status !== 204) {
      try {
        body = (await response.json()) as JsonBody;
      } catch {
        body = null;
      }
    }
    return { status: response.status, body };
  } catch (error) {
    if (error instanceof AuthError) throw error;
    // AbortError (15s timeout), DNS failure, CORS rejection, offline.
    throw new AuthError('NETWORK', 'Network request failed.');
  } finally {
    clearTimeout(timer);
  }
}

function bodyString(body: JsonBody | null, key: string): string | undefined {
  const value = body?.[key];
  return typeof value === 'string' ? value : undefined;
}

function fieldErrors(body: JsonBody | null): AuthFieldErrors | undefined {
  const raw = body?.fields;
  if (!raw || typeof raw !== 'object') return undefined;

  const fields: AuthFieldErrors = {};
  Object.entries(raw as Record<string, unknown>).forEach(([key, value]) => {
    if (typeof value === 'string') {
      fields[key] = [value];
      return;
    }
    if (Array.isArray(value)) {
      const messages = value.filter((item): item is string => typeof item === 'string');
      if (messages.length) fields[key] = messages;
    }
  });

  return Object.keys(fields).length ? fields : undefined;
}

function toAuthError(status: number, body: JsonBody | null, fallback: string): AuthError {
  const code = bodyString(body, 'code');
  const message = bodyString(body, 'message') ?? fallback;

  if (status === 429 || code === 'RATE_LIMITED') {
    return new AuthError('RATE_LIMITED', message);
  }
  if (status === 409 || code === 'EMAIL_TAKEN') {
    return new AuthError('EMAIL_TAKEN', message);
  }
  if (status === 401) {
    return new AuthError('INVALID_CREDENTIALS', message);
  }
  if (code === 'VALIDATION' || status === 400) {
    return new AuthError('VALIDATION', message, fieldErrors(body));
  }
  return new AuthError('UNKNOWN', message);
}

function parseUser(value: unknown): User | null {
  if (!value || typeof value !== 'object') return null;

  const raw = value as Record<string, unknown>;
  const id = typeof raw.id === 'string' ? raw.id : undefined;
  const email = typeof raw.email === 'string' ? raw.email : undefined;
  if (!id || !email) return null;

  const user: User = {
    id,
    email,
    name: typeof raw.name === 'string' && raw.name ? raw.name : email,
  };
  if (typeof raw.role === 'string' && raw.role) user.role = raw.role;
  if (typeof raw.company === 'string' && raw.company) user.company = raw.company;
  if (typeof raw.avatarUrl === 'string' && raw.avatarUrl) {
    user.avatarUrl = raw.avatarUrl;
  }
  return user;
}

function parseSession(body: JsonBody | null): Session | null {
  const token = bodyString(body, 'token');
  const user = parseUser(body?.user);
  return token && user ? { user, token } : null;
}

export const apiAdapter: AuthAdapter = {
  async signUp({ name, email, password }: SignUpInput): Promise<Session> {
    const { status, body } = await request('/auth/register', {
      method: 'POST',
      payload: { name: name.trim(), email: email.trim().toLowerCase(), password },
    });

    if (status === 201) {
      const session = parseSession(body);
      if (session) return session;
      throw new AuthError('UNKNOWN', 'The server returned an unexpected response.');
    }

    throw toAuthError(status, body, 'Registration failed. Please try again.');
  },

  async signIn({ email, password }: SignInInput): Promise<Session> {
    const { status, body } = await request('/auth/login', {
      method: 'POST',
      payload: { email: email.trim().toLowerCase(), password },
    });

    if (status === 200) {
      const session = parseSession(body);
      if (session) return session;
      throw new AuthError('UNKNOWN', 'The server returned an unexpected response.');
    }

    if (status === 401) {
      throw new AuthError(
        'INVALID_CREDENTIALS',
        bodyString(body, 'message') ?? 'Incorrect email or password.'
      );
    }
    throw toAuthError(status, body, 'Sign-in failed. Please try again.');
  },

  async signOut(token?: string): Promise<void> {
    if (!token) return;
    try {
      await request('/auth/logout', { method: 'POST', token });
    } catch {
      // Offline or already-invalid token: local state is cleared by authService.
    }
  },

  async fetchUser(token: string): Promise<User> {
    const { status, body } = await request('/auth/me', { token });

    if (status === 200) {
      const user = parseUser(body?.user);
      if (user) return user;
      throw new AuthError('UNKNOWN', 'The server returned an unexpected response.');
    }

    if (status === 401) {
      throw new AuthError(
        'UNAUTHENTICATED',
        bodyString(body, 'message') ?? 'Your session has expired.'
      );
    }
    throw toAuthError(status, body, 'Could not load your account.');
  },

  async requestPasswordReset(email: string): Promise<{ sent: boolean; demo?: boolean }> {
    const { status, body } = await request('/auth/password-reset', {
      method: 'POST',
      payload: { email: email.trim().toLowerCase() },
    });

    if (status === 200) return { sent: true };
    throw toAuthError(status, body, 'Password reset could not be requested.');
  },
};

/** Exported for docs: the API base URL the adapter resolved. */
export const API_BASE_URL = BASE_URL;
