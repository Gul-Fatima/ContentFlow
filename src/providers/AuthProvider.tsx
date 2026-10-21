import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import * as authService from '../services/auth/authService';
import type {
  Session,
  SignInInput,
  SignUpInput,
  User,
} from '../services/auth/types';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

export interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  signIn: (input: SignInInput & { remember: boolean }) => Promise<Session>;
  signUp: (input: SignUpInput & { remember?: boolean }) => Promise<Session>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Restores the persisted session once on mount, then exposes sign-in/out to the
 * whole tree. `status` stays 'loading' until that read finishes so route guards
 * never flicker to the welcome screen for a returning user.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let active = true;

    authService
      .getSession()
      .then((session) => {
        if (!active) return;
        setUser(session?.user ?? null);
        setStatus(session ? 'authenticated' : 'unauthenticated');
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        setStatus('unauthenticated');
      });

    return () => {
      active = false;
    };
  }, []);

  const signIn = useCallback(
    async (input: SignInInput & { remember: boolean }) => {
      const session = await authService.signIn(input);
      setUser(session.user);
      setStatus('authenticated');
      return session;
    },
    []
  );

  const signUp = useCallback(
    async (input: SignUpInput & { remember?: boolean }) => {
      const session = await authService.signUp(input);
      setUser(session.user);
      setStatus('authenticated');
      return session;
    },
    []
  );

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
    setStatus('unauthenticated');
  }, []);

  const value = useMemo(
    () => ({ status, user, signIn, signUp, signOut }),
    [status, user, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return value;
}
