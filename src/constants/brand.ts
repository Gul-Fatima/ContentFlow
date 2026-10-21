import type { ImageSourcePropType } from 'react-native';

export const BRAND = {
  name: 'ContentEngine',
  tagline: 'AI-powered social media management',
} as const;

/**
 * Placeholder for the script-style wordmark exported from Figma. Until that
 * asset lands, `Logo` renders BRAND.name as plain text.
 */
export const WORDMARK_IMAGE: ImageSourcePropType | null = null;
