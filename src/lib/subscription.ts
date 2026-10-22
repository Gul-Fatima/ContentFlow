import type { Subscription } from '../services/billing/types';
import { formatDate } from './format';

export type StatusTone = 'success' | 'danger' | 'warning' | 'neutral';

export interface StatusPill {
  label: string;
  tone: StatusTone;
}

const PLAN_NAMES: Record<Subscription['plan'], string> = {
  none: 'No plan',
  starter: 'Starter',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

/** "pro" -> "Pro"; unknown ids fall back to a capitalised id. */
export function planName(plan: Subscription['plan'] | undefined): string {
  if (!plan) return PLAN_NAMES.none;
  return (
    PLAN_NAMES[plan] ??
    plan.charAt(0).toUpperCase() + plan.slice(1)
  );
}

/** True once the user has ever subscribed (used to show "Manage billing"). */
export function hasBillingAccount(
  subscription: Subscription | null | undefined
): boolean {
  if (!subscription) return false;
  return subscription.plan !== 'none' || subscription.status !== 'none';
}

/** True when the subscription is live (active or trialing). */
export function hasActivePlan(
  subscription: Subscription | null | undefined
): boolean {
  return !!subscription?.isActive;
}

/**
 * The status pill shown next to the plan name. A failed payment outranks
 * "canceling" because it is the one the user must act on.
 */
export function statusPill(
  subscription: Subscription | null | undefined
): StatusPill | null {
  if (!subscription || subscription.plan === 'none') return null;

  if (subscription.status === 'past_due' || subscription.status === 'unpaid') {
    return { label: 'Past due', tone: 'danger' };
  }
  if (subscription.cancelAtPeriodEnd) {
    return { label: 'Canceling', tone: 'warning' };
  }
  if (subscription.isActive) {
    return { label: 'Active', tone: 'success' };
  }
  if (subscription.status === 'canceled') {
    return { label: 'Canceled', tone: 'neutral' };
  }
  const label = subscription.status.replace(/_/g, ' ');
  return {
    label: label.charAt(0).toUpperCase() + label.slice(1),
    tone: 'neutral',
  };
}

/** "Renews on Feb 27, 2026" / "Ends on …" when cancelling; '' without a date. */
export function renewalLabel(
  subscription: Subscription | null | undefined
): string {
  if (!subscription?.currentPeriodEnd) return '';
  const date = formatDate(subscription.currentPeriodEnd);
  if (!date) return '';
  return subscription.cancelAtPeriodEnd ? `Ends on ${date}` : `Renews on ${date}`;
}

/** 0–100 usage bar width; 0 when the plan is unlimited or the limit is 0. */
export function usagePercent(
  used: number,
  limit: number | null | undefined
): number {
  if (!limit || limit <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((used / limit) * 100)));
}
