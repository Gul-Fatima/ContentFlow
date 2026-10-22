import { secureGet, secureRemove, secureSet } from '../../lib/storage';
import { apiAdapter } from './apiAdapter';
import { mockAdapter } from './mockAdapter';
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
 * Picks the backend for auth:
 *  - EXPO_PUBLIC_AUTH_MODE=mock | api wins when set.
 *  - Otherwise the real API is used as soon as EXPO_PUBLIC_API_URL is set,
 *    and the local mock adapter only when it is not.
 */
const declaredMode = process.env.EXPO_PUBLIC_AUTH_MODE;
const hasApiUrl = !!process.env.EXPO_PUBLIC_API_URL;
const mode: 'mock' | 'api' =
  declaredMode === 'api' || declaredMode === 'mock'
    ? declaredMode
    : hasApiUrl
      ? 'api'
      : 'mock';

/** True when accounts are local-only (dev mock adapter). */
export const AUTH_IS_DEMO = mode === 'mock';

const adapter: AuthAdapter = mode === 'mock' ? mockAdapter : apiAdapter;

const SESSION_KEY = 'auth:session';

/**
 * Sessions with `remember: false` live only here, so they disappear when the
 * app process ends. Remembered sessions are written to secure storage.
 */
let memorySession: Session | null = null;

function isSession(value: unknown): value is Session {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<Session>;
  return (
    typeof candidate.token === 'string' &&
    !!candidate.user &&
    typeof candidate.user.id === 'string' &&
    typeof candidate.user.email === 'string'
  );
}

async function persist(session: Session, remember: boolean): Promise<void> {
  if (!remember) {
    // Drop any previously remembered session so it can't resurface on reload.
    await secureRemove(SESSION_KEY);
    return;
  }
  await secureSet(SESSION_KEY, JSON.stringify(session));
}

export interface AuthCredentials extends SignInInput {
  remember: boolean;
}

export interface AuthSignUp extends SignUpInput {
  remember?: boolean;
}

export async function signUp({
  name,
  email,
  password,
  remember = true,
}: AuthSignUp): Promise<Session> {
  const session = await adapter.signUp({ name, email, password });
  await persist(session, remember);
  memorySession = session;
  return session;
}

export async function signIn({
  email,
  password,
  remember,
}: AuthCredentials): Promise<Session> {
  const session = await adapter.signIn({ email, password });
  await persist(session, remember);
  memorySession = session;
  return session;
}

export async function signOut(): Promise<void> {
  const session = memorySession ?? (await getSession());
  try {
    // Best-effort server-side revocation; clearing local state must never fail.
    await adapter.signOut(session?.token);
  } catch {
    // Ignored on purpose: offline or already-expired tokens still sign out.
  }
  memorySession = null;
  await secureRemove(SESSION_KEY);
}

export async function getSession(): Promise<Session | null> {
  if (memorySession) return memorySession;

  const raw = await secureGet(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isSession(parsed)) {
      await secureRemove(SESSION_KEY);
      return null;
    }
    memorySession = parsed;
    return parsed;
  } catch {
    await secureRemove(SESSION_KEY);
    return null;
  }
}

/**
 * Re-reads the signed-in user from the backend (`GET /auth/me`).
 * Returns null and clears the stored session when the token is no longer valid;
 * keeps the cached user when the request fails for network reasons.
 */
export async function refreshUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  // The mock adapter has no server-side session to validate.
  if (!adapter.fetchUser) return session.user;

  let user: User;
  try {
    user = await adapter.fetchUser(session.token);
  } catch (error) {
    if (error instanceof AuthError && error.code === 'UNAUTHENTICATED') {
      memorySession = null;
      await secureRemove(SESSION_KEY);
      return null;
    }
    return session.user;
  }

  const next: Session = { ...session, user };
  memorySession = next;
  // Only touch storage when the session was actually persisted (remember=true).
  if (await secureGet(SESSION_KEY)) {
    await secureSet(SESSION_KEY, JSON.stringify(next));
  }
  return user;
}

export function requestPasswordReset(
  email: string
): Promise<{ sent: boolean; demo?: boolean }> {
  return adapter.requestPasswordReset(email);
}

/** Maps adapter failures to the copy shown next to the form. */
export function authErrorMessage(error: unknown): string {
  const code = error instanceof AuthError ? error.code : 'UNKNOWN';
  switch (code) {
    case 'INVALID_CREDENTIALS':
      return 'Incorrect email or password.';
    case 'EMAIL_TAKEN':
      return 'An account with this email already exists.';
    case 'NETWORK':
      return 'Network error. Check your connection and try again.';
    case 'RATE_LIMITED':
      return 'Too many attempts. Please wait a minute and try again.';
    case 'VALIDATION':
      return 'Please check the details you entered and try again.';
    case 'UNAUTHENTICATED':
      return 'Your session expired. Please sign in again.';
    case 'NOT_CONFIGURED':
      return "Sign-in isn't configured yet.";
    default:
      return 'Something went wrong. Please try again.';
  }
}

/** Server field messages for VALIDATION errors (empty for every other error). */
export function authFieldErrors(error: unknown): AuthFieldErrors {
  if (error instanceof AuthError && error.code === 'VALIDATION') {
    return error.fields ?? {};
  }
  return {};
}

/** True when the backend identified the caller; exported for future tasks. */
export function currentUser(): User | null {
  return memorySession?.user ?? null;
}
