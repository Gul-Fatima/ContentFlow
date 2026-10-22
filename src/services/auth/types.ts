/** Shared auth contracts. Adapters implement `AuthAdapter`; the UI never sees one. */

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  /** Free-text job title shown next to the name; empty when unknown. */
  role?: string;
  /** Organisation the user belongs to; empty when unknown. */
  company?: string;
}

export interface Session {
  user: User;
  token: string;
}

export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_TAKEN'
  | 'NETWORK'
  | 'NOT_CONFIGURED'
  | 'RATE_LIMITED'
  | 'VALIDATION'
  | 'UNAUTHENTICATED'
  | 'UNKNOWN';

/** Server-provided per-field messages, e.g. `{ email: ['Enter a valid email.'] }`. */
export type AuthFieldErrors = Record<string, string[]>;

export class AuthError extends Error {
  code: AuthErrorCode;
  /** Present on VALIDATION errors; keys match the API's field names. */
  fields?: AuthFieldErrors;

  constructor(code: AuthErrorCode, message?: string, fields?: AuthFieldErrors) {
    super(message ?? code);
    this.name = 'AuthError';
    this.code = code;
    this.fields = fields;
    // Required so `instanceof AuthError` survives transpilation to ES5.
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface AuthAdapter {
  signUp(input: SignUpInput): Promise<Session>;
  signIn(input: SignInInput): Promise<Session>;
  /** Revokes the token server-side. A no-op when there is nothing to revoke. */
  signOut(token?: string): Promise<void>;
  requestPasswordReset(email: string): Promise<{ sent: boolean; demo?: boolean }>;
  /**
   * Re-reads the signed-in user from the backend. Omitted by adapters with no
   * server-side session (the local mock). Throws UNAUTHENTICATED on a bad token.
   */
  fetchUser?(token: string): Promise<User>;
}
