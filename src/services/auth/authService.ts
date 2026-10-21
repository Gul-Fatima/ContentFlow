import { secureGet, secureRemove, secureSet } from '../../lib/storage';
import { apiAdapter } from './apiAdapter';
import { mockAdapter } from './mockAdapter';
import {
  AuthError,
  type AuthAdapter,
  type Session,
  type SignInInput,
  type SignUpInput,
  type User,
} from './types';

/**
 * Picks the backend for auth:
 *  - EXPO_PUBLIC_AUTH_MODE=mock | api wins when set.
 *  - Otherwise development defaults to the local mock adapter and production
 *    builds default to the real API (never silently fake a login in prod).
 */
const declaredMode = process.env.EXPO_PUBLIC_AUTH_MODE;
const mode: 'mock' | 'api' =
  declaredMode === 'api' ? 'api' : declaredMode === 'mock' ? 'mock' : __DEV__ ? 'mock' : 'api';

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
  try {
    await adapter.signOut();
  } catch {
    // Server-side revocation is best-effort; local state must always clear.
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
    case 'NOT_CONFIGURED':
      return "Sign-in isn't configured yet.";
    default:
      return 'Something went wrong. Please try again.';
  }
}

/** True when the backend identified the caller; exported for future tasks. */
export function currentUser(): User | null {
  return memorySession?.user ?? null;
}
