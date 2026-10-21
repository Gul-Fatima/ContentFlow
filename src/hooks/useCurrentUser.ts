import { useMemo } from 'react';
import { useAuth } from '../providers/AuthProvider';
import type { User } from '../services/auth/types';

export interface CurrentUser {
  /** The signed-in user, or null while signed out. */
  user: User | null;
  /** First word of the name, e.g. "Alex" for "Alex Morgan". */
  firstName: string;
  /** Everything after the first space, e.g. "Morgan" for "Alex Morgan". */
  lastName: string;
  /** First letter of the first and last name, uppercase ("AM"). */
  initials: string;
  /** Job title, or an empty string when the account has none. */
  role: string;
  /** Organisation, or an empty string when the account has none. */
  company: string;
}

/**
 * Single source of truth for "who is signed in". Every screen that shows a
 * name, an avatar, a role or a company reads it from the auth session, so
 * there is no hard-coded identity anywhere in the app.
 */
export function useCurrentUser(): CurrentUser {
  const { user } = useAuth();

  return useMemo(() => {
    const name = (user?.name ?? '').trim();
    const parts = name ? name.split(/\s+/) : [];
    const first = parts[0] ?? '';
    const last = parts.slice(1).join(' ');

    return {
      user: user ?? null,
      firstName: first,
      lastName: last,
      // First letter of the first and the last name, uppercase. A single-word
      // name yields one initial.
      initials: `${first.charAt(0)}${last.charAt(0)}`.toUpperCase(),
      role: user?.role?.trim() ?? '',
      company: user?.company?.trim() ?? '',
    };
  }, [user]);
}
