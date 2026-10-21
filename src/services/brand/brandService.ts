import { AuthError } from '../auth/types';
import { getMockBrandProfile, saveMockBrandProfile } from './mockAdapter';
import type { BrandProfile } from './types';

const useApi =
  process.env.EXPO_PUBLIC_AUTH_MODE === 'api' ||
  Boolean(process.env.EXPO_PUBLIC_API_URL);

export async function saveBrandProfile(
  userId: string,
  profile: BrandProfile
): Promise<void> {
  if (useApi) {
    // TODO(brand-contract): PUT /brand-profile with the authenticated user profile.
    throw new AuthError('NOT_CONFIGURED', 'Brand profile API is not configured.');
  }
  await saveMockBrandProfile(userId, profile);
}

export async function getBrandProfile(
  userId: string
): Promise<BrandProfile | null> {
  if (useApi) {
    // TODO(brand-contract): GET /brand-profile for the authenticated user.
    throw new AuthError('NOT_CONFIGURED', 'Brand profile API is not configured.');
  }
  return getMockBrandProfile(userId);
}
