import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { ROUTES } from '../constants/routes';
import { useAuth } from '../providers/AuthProvider';

export interface UseLogoutResult {
  /** Signs the user out and returns to the welcome screen. */
  logout: () => Promise<void>;
  /** True while the sign-out is in flight (buttons show a spinner). */
  isLoggingOut: boolean;
}

/**
 * The single sign-out path for the whole app: the sidebar button, the profile
 * menu and the profile Security tab all call this, so there is exactly one
 * place that ends a session.
 *
 * @param closeMenu Optional callback that closes the menu/drawer hosting the
 *   logout control. Called first so the menu is gone before the navigation.
 */
export function useLogout(closeMenu?: () => void): UseLogoutResult {
  const { signOut } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = useCallback(async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      closeMenu?.();
      await signOut();
      router.replace(ROUTES.welcome);
    } finally {
      setIsLoggingOut(false);
    }
  }, [closeMenu, isLoggingOut, router, signOut]);

  return { logout, isLoggingOut };
}
