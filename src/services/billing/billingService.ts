import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import { ApiError, apiFetch, HAS_API, type ApiFetchOptions } from '../../lib/api';
import type {
  CheckoutInput,
  Invoice,
  Plan,
  PlanId,
  Subscription,
} from './types';

/**
 * Billing API client (see docs/BILLING_CONTRACT.md).
 *
 * Every call needs the backend: without EXPO_PUBLIC_API_URL (mock/demo mode)
 * they reject with ApiError `PAYMENTS_NOT_CONFIGURED` rather than inventing a
 * plan locally. Payment state is never guessed on the device.
 */
const NOT_CONFIGURED_MESSAGE = "Payments aren't set up yet.";

function notConfigured(): ApiError {
  return new ApiError(503, 'PAYMENTS_NOT_CONFIGURED', NOT_CONFIGURED_MESSAGE);
}

async function billingFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  if (!HAS_API) throw notConfigured();
  return apiFetch<T>(path, options);
}

/**
 * The base Stripe should send the customer back to: the web origin in a
 * browser, the app's deep link on native (`agentai://…` in a build,
 * `exp://…/--/` in Expo Go).
 */
export function returnUrlBase(): string {
  if (
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    window.location?.origin
  ) {
    return window.location.origin;
  }
  return Linking.createURL('');
}

// --- response parsing ------------------------------------------------------

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object';
}

function numberOf(value: unknown, fallback: number | null): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function parsePlan(raw: unknown): Plan {
  const plan = isRecord(raw) ? raw : {};
  const limits = isRecord(plan.limits) ? plan.limits : {};
  const features = Array.isArray(plan.features) ? plan.features : [];

  return {
    id: String(plan.id ?? '') as PlanId,
    name: String(plan.name ?? ''),
    tagline: String(plan.tagline ?? ''),
    monthlyCents: numberOf(plan.monthlyCents, 0) ?? 0,
    yearlyCents: numberOf(plan.yearlyCents, 0) ?? 0,
    popular: plan.popular === true,
    limits: {
      workspaces: numberOf(limits.workspaces, null),
      postsPerMonth: numberOf(limits.postsPerMonth, null),
      credits: numberOf(limits.credits, null),
      platforms: numberOf(limits.platforms, null),
      seats: numberOf(limits.seats, null),
    },
    features: features
      .filter(isRecord)
      .map((feature) => ({
        label: String(feature.label ?? ''),
        included: feature.included === true,
      })),
  };
}

function parseSubscription(raw: unknown): Subscription {
  const value = isRecord(raw) ? raw : {};
  const usage = isRecord(value.usage) ? value.usage : {};
  const limits = isRecord(value.limits) ? value.limits : {};
  const interval = value.interval;

  return {
    plan: (value.plan === 'starter' ||
    value.plan === 'pro' ||
    value.plan === 'enterprise'
      ? value.plan
      : 'none') as Subscription['plan'],
    interval: interval === 'month' || interval === 'year' ? interval : null,
    status: typeof value.status === 'string' ? value.status : 'none',
    isActive: value.isActive === true,
    currentPeriodEnd:
      typeof value.currentPeriodEnd === 'string' ? value.currentPeriodEnd : null,
    cancelAtPeriodEnd: value.cancelAtPeriodEnd === true,
    usage: {
      postsUsed: numberOf(usage.postsUsed, 0) ?? 0,
      postsLimit: numberOf(usage.postsLimit, null),
      creditsUsed: numberOf(usage.creditsUsed, 0) ?? 0,
      creditsLimit: numberOf(usage.creditsLimit, null),
    },
    limits: {
      workspaces: numberOf(limits.workspaces, null),
      postsPerMonth: numberOf(limits.postsPerMonth, null),
      credits: numberOf(limits.credits, null),
      platforms: numberOf(limits.platforms, null),
      seats: numberOf(limits.seats, null),
    },
  };
}

function parseInvoice(raw: unknown): Invoice {
  const value = isRecord(raw) ? raw : {};
  return {
    id: String(value.id ?? ''),
    number: String(value.number ?? ''),
    amountCents: numberOf(value.amountCents, 0) ?? 0,
    currency: String(value.currency ?? 'usd'),
    status: String(value.status ?? 'open'),
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : null,
    hostedInvoiceUrl:
      typeof value.hostedInvoiceUrl === 'string' ? value.hostedInvoiceUrl : null,
    pdfUrl: typeof value.pdfUrl === 'string' ? value.pdfUrl : null,
  };
}

// --- endpoints -------------------------------------------------------------

/** The catalog. Public: no token needed, no Stripe price ids exposed. */
export async function getPlans(): Promise<Plan[]> {
  const data = await billingFetch<{ plans?: unknown[] }>('/billing/plans', {
    auth: false,
  });
  if (!Array.isArray(data?.plans)) {
    throw new ApiError(200, 'UNKNOWN', 'The server returned an unexpected response.');
  }
  return data.plans.map(parsePlan);
}

/**
 * The caller's subscription.
 *
 * @param refresh ask the backend to re-read it from Stripe first — used after
 *   Checkout to cover webhook delay.
 */
export async function getSubscription(
  { refresh = false }: { refresh?: boolean } = {}
): Promise<Subscription> {
  const data = await billingFetch<{ subscription?: unknown }>(
    `/billing/subscription${refresh ? '?refresh=1' : ''}`
  );
  return parseSubscription(data?.subscription);
}

/** A Stripe Checkout URL. Card details are entered on Stripe's page only. */
export async function startCheckout({
  plan,
  interval,
}: CheckoutInput): Promise<{ url: string }> {
  const data = await billingFetch<{ url?: string }>('/billing/checkout', {
    method: 'POST',
    body: {
      plan,
      interval,
      returnUrl: returnUrlBase(),
    },
  });
  if (!data?.url) {
    throw new ApiError(200, 'UNKNOWN', 'The server returned an unexpected response.');
  }
  return { url: data.url };
}

/** A Stripe Billing Portal URL (payment method, cancel, switch plan). */
export async function openPortal(): Promise<{ url: string }> {
  const data = await billingFetch<{ url?: string }>('/billing/portal', {
    method: 'POST',
    body: {},
  });
  if (!data?.url) {
    throw new ApiError(200, 'UNKNOWN', 'The server returned an unexpected response.');
  }
  return { url: data.url };
}

/** The last 12 invoices. Empty when the user has no Stripe customer yet. */
export async function listInvoices(): Promise<Invoice[]> {
  const data = await billingFetch<{ invoices?: unknown[] }>('/billing/invoices');
  if (!Array.isArray(data?.invoices)) return [];
  return data.invoices.map(parseInvoice);
}

// --- copy ------------------------------------------------------------------

/** User-facing message for a billing failure (Review modal, banners, toasts). */
export function billingErrorMessage(error: unknown): string {
  const code = error instanceof ApiError ? error.code : 'UNKNOWN';
  switch (code) {
    case 'PAYMENTS_NOT_CONFIGURED':
      return "Payments aren't set up yet. Please try again later.";
    case 'ALREADY_SUBSCRIBED':
      return 'You already have an active plan.';
    case 'NETWORK':
      return 'Network error. Check your connection and try again.';
    case 'RATE_LIMITED':
      return 'Too many attempts. Please wait a minute.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
