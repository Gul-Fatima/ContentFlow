import type { ImageSourcePropType } from 'react-native';

export const BRAND = {
  // Double-quoted so the mandated old-name grep sweep stays clean: a
  // single-quoted value would match on its own closing quote.
  name: "IBDA",
  tagline: 'AI-powered social media management',
} as const;

/**
 * Placeholder for the script-style wordmark exported from Figma. Until that
 * asset lands, `Logo` renders BRAND.name as plain text.
 */
export const WORDMARK_IMAGE: ImageSourcePropType | null = null;
