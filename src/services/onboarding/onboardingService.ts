import { kvGet, kvSet } from '../../lib/storage';
import { ROUTES, type AppRoute } from '../../constants/routes';
import type { BrandProfile } from '../brand/types';

export type OnboardingStep = 1 | 2 | 3;
export type OnboardingStatus = 'pending' | 'completed' | 'skipped';

export interface OnboardingRecord {
  status: OnboardingStatus;
  step: OnboardingStep;
  draft: Partial<BrandProfile>;
}

function storageKey(userId: string): string {
  return `onboarding:${userId}`;
}

export async function getOnboarding(
  userId: string
): Promise<OnboardingRecord | null> {
  return kvGet<OnboardingRecord>(storageKey(userId));
}

export async function markPending(userId: string): Promise<void> {
  await kvSet<OnboardingRecord>(storageKey(userId), {
    status: 'pending',
    step: 1,
    draft: {},
  });
}

export async function saveDraft(
  userId: string,
  step: OnboardingStep,
  draft: Partial<BrandProfile>
): Promise<void> {
  const current = await getOnboarding(userId);
  await kvSet<OnboardingRecord>(storageKey(userId), {
    status: 'pending',
    step,
    draft: { ...current?.draft, ...draft },
  });
}

export async function complete(userId: string): Promise<void> {
  const current = await getOnboarding(userId);
  await kvSet<OnboardingRecord>(storageKey(userId), {
    status: 'completed',
    step: 3,
    draft: current?.draft ?? {},
  });
}

export async function skip(userId: string): Promise<void> {
  const current = await getOnboarding(userId);
  await kvSet<OnboardingRecord>(storageKey(userId), {
    status: 'skipped',
    step: current?.step ?? 1,
    draft: current?.draft ?? {},
  });
}

export async function getPostAuthRoute(userId: string): Promise<AppRoute> {
  const onboarding = await getOnboarding(userId);
  return onboarding?.status === 'pending'
    ? ROUTES.onboarding
    : ROUTES.dashboard;
}
