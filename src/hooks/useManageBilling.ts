import { useCallback, useState } from 'react';
import { ApiError } from '../lib/api';
import { openBillingPortal } from '../lib/openExternal';
import {
  billingErrorMessage,
  openPortal,
} from '../services/billing/billingService';

export interface ManageBilling {
  /** Requests a Portal session and opens it. No-op while already opening. */
  manageBilling: () => Promise<void>;
  isOpening: boolean;
  /** User-facing failure message, or null. */
  error: string | null;
}

/**
 * "Manage billing" appears in four places (plan card, pricing page, billing
 * tab, success screen). They all go through the Billing Portal — never a second
 * Checkout — so the flow lives here once.
 */
export function useManageBilling(): ManageBilling {
  const [isOpening, setIsOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manageBilling = useCallback(async () => {
    setIsOpening(true);
    setError(null);
    try {
      const { url } = await openPortal();
      await openBillingPortal(url);
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.code === 'NO_BILLING_ACCOUNT'
          ? 'No billing account yet. Choose a plan first.'
          : billingErrorMessage(caught)
      );
    } finally {
      setIsOpening(false);
    }
  }, []);

  return { manageBilling, isOpening, error };
}
