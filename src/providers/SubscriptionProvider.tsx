import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ApiError } from '../lib/api';
import { getSubscription } from '../services/billing/billingService';
import type { Subscription } from '../services/billing/types';
import { useAuth } from './AuthProvider';

export interface SubscriptionContextValue {
  /** null before the first load and while the user has no plan. */
  subscription: Subscription | null;
  /** True only for the initial load, so cards can show a skeleton. */
  loading: boolean;
  error: ApiError | null;
  /** Re-read from the backend (optionally asking it to refresh from Stripe). */
  reload: (options?: { refresh?: boolean }) => Promise<Subscription | null>;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(
  undefined
);

/**
 * Single source of truth for "what plan is this user on".
 *
 * Mounted inside the authenticated (app) layout, so it loads once per sign-in.
 * It never infers a plan locally: an unconfigured backend or a network failure
 * is an error, not a fake "Pro".
 */
export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  // Sign-out clears the plan during render (React's "adjust state when a prop
  // changes" pattern): no effect, so no extra render pass and no stale card.
  const [lastStatus, setLastStatus] = useState(status);
  if (lastStatus !== status) {
    setLastStatus(status);
    if (status === 'unauthenticated') {
      setSubscription(null);
      setError(null);
      setLoading(false);
    }
  }

  // Guards against setState after unmount / a stale response winning a race.
  const activeRef = useRef(true);
  const requestRef = useRef(0);

  useEffect(() => {
    activeRef.current = true;
    return () => {
      activeRef.current = false;
    };
  }, []);

  const reload = useCallback(
    async ({ refresh = false }: { refresh?: boolean } = {}) => {
      const request = ++requestRef.current;
      try {
        const next = await getSubscription({ refresh });
        if (!activeRef.current || request !== requestRef.current) return next;
        setSubscription(next);
        setError(null);
        return next;
      } catch (caught) {
        if (!activeRef.current || request !== requestRef.current) return null;
        setError(
          caught instanceof ApiError
            ? caught
            : new ApiError(0, 'UNKNOWN', 'Could not load your plan.')
        );
        return null;
      }
    },
    []
  );

  useEffect(() => {
    if (status !== 'authenticated') return;

    let cancelled = false;
    getSubscription()
      .then((next) => {
        if (cancelled) return;
        setSubscription(next);
        setError(null);
      })
      .catch((caught) => {
        if (cancelled) return;
        setError(
          caught instanceof ApiError
            ? caught
            : new ApiError(0, 'UNKNOWN', 'Could not load your plan.')
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status]);

  const value = useMemo(
    () => ({ subscription, loading, error, reload }),
    [subscription, loading, error, reload]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription(): SubscriptionContextValue {
  const value = useContext(SubscriptionContext);
  if (!value) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return value;
}
