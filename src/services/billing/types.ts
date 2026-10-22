/** Billing contracts — mirrors docs/BILLING_CONTRACT.md. */

export type PlanId = 'starter' | 'pro' | 'enterprise';
export type BillingInterval = 'month' | 'year';
/** Subscription.plan is 'none' when the user has never subscribed. */
export type SubscriptionPlan = PlanId | 'none';

/** `null` means unlimited (or, for platforms, all of them). */
export interface PlanLimits {
  workspaces: number | null;
  postsPerMonth: number | null;
  credits: number | null;
  platforms: number | null;
  seats: number | null;
}

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  tagline: string;
  monthlyCents: number;
  yearlyCents: number;
  popular: boolean;
  limits: PlanLimits;
  features: PlanFeature[];
}

export interface SubscriptionUsage {
  postsUsed: number;
  postsLimit: number | null;
  creditsUsed: number;
  creditsLimit: number | null;
}

export interface Subscription {
  plan: SubscriptionPlan;
  interval: BillingInterval | null;
  /** Raw Stripe status ('none' before the first subscription). */
  status: string;
  isActive: boolean;
  /** ISO 8601, or null when there is no subscription. */
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  usage: SubscriptionUsage;
  limits: PlanLimits;
}

export interface Invoice {
  id: string;
  number: string;
  amountCents: number;
  currency: string;
  status: string;
  createdAt: string | null;
  hostedInvoiceUrl: string | null;
  pdfUrl: string | null;
}

export interface CheckoutInput {
  plan: PlanId;
  interval: BillingInterval;
}
