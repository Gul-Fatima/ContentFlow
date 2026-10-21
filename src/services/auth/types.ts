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
  | 'UNKNOWN';

export class AuthError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message?: string) {
    super(message ?? code);
    this.name = 'AuthError';
    this.code = code;
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
  signOut(): Promise<void>;
  requestPasswordReset(email: string): Promise<{ sent: boolean; demo?: boolean }>;
}
