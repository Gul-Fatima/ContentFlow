import { CryptoDigestAlgorithm, digestStringAsync, randomUUID } from 'expo-crypto';
import { kvGet, kvSet } from '../../lib/storage';
import {
  AuthError,
  type AuthAdapter,
  type Session,
  type SignInInput,
  type SignUpInput,
} from './types';

/**
 * Honest local adapter for development. Accounts exist only on this device and
 * passwords are never stored — only a salted SHA-256 digest, so a wrong
 * password genuinely fails. It is NOT a security boundary: anyone with access
 * to the device storage could forge an entry.
 */
interface MockUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

const USERS_KEY = 'mock:users';
const FAKE_LATENCY_MS = 600;

const normalizeEmail = (email: string) => email.trim().toLowerCase();

/** The most recent mock session, kept in memory so signOut can match its token. */
let activeSession: { token: string; user: MockUser } | null = null;

async function delay(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, FAKE_LATENCY_MS));
}

async function hashPassword(email: string, password: string): Promise<string> {
  return digestStringAsync(
    CryptoDigestAlgorithm.SHA256,
    `${normalizeEmail(email)}:${password}`
  );
}

async function readUsers(): Promise<MockUser[]> {
  return (await kvGet<MockUser[]>(USERS_KEY)) ?? [];
}

function toSession(user: MockUser): Session {
  const session: Session = {
    user: { id: user.id, name: user.name, email: user.email },
    token: randomUUID(),
  };
  activeSession = { token: session.token, user };
  return session;
}

export const mockAdapter: AuthAdapter = {
  async signUp({ name, email, password }: SignUpInput): Promise<Session> {
    await delay();
    const users = await readUsers();
    const normalized = normalizeEmail(email);

    if (users.some((user) => user.email === normalized)) {
      throw new AuthError('EMAIL_TAKEN', 'An account with this email already exists.');
    }

    const created: MockUser = {
      id: randomUUID(),
      name: name.trim(),
      email: normalized,
      passwordHash: await hashPassword(email, password),
    };
    await kvSet(USERS_KEY, [...users, created]);

    return toSession(created);
  },

  async signIn({ email, password }: SignInInput): Promise<Session> {
    await delay();
    const users = await readUsers();
    const normalized = normalizeEmail(email);
    const found = users.find((user) => user.email === normalized);

    if (!found) {
      throw new AuthError('INVALID_CREDENTIALS', 'Incorrect email or password.');
    }

    const attemptedHash = await hashPassword(email, password);
    if (attemptedHash !== found.passwordHash) {
      throw new AuthError('INVALID_CREDENTIALS', 'Incorrect email or password.');
    }

    return toSession(found);
  },

  async signOut(token?: string): Promise<void> {
    // Nothing server-side to revoke; the session lives in secure storage and is
    // cleared by authService.
    if (!token || activeSession?.token === token) activeSession = null;
  },

  async requestPasswordReset(): Promise<{ sent: boolean; demo?: boolean }> {
    await delay();
    // No email transport in demo mode: never claim a message was sent.
    return { sent: false, demo: true };
  },
};
