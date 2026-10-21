import { kvGet, kvSet } from '../../lib/storage';
import type { BrandProfile } from './types';

function storageKey(userId: string): string {
  return `mock:brand:${userId}`;
}

export async function saveMockBrandProfile(
  userId: string,
  profile: BrandProfile
): Promise<void> {
  await kvSet(storageKey(userId), profile);
}

export async function getMockBrandProfile(
  userId: string
): Promise<BrandProfile | null> {
  return kvGet<BrandProfile>(storageKey(userId));
}
