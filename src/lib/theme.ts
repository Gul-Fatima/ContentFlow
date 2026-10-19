/**
 * Raw token values for the few places where Tailwind classes can't reach:
 * icon `color` props, `placeholderTextColor`, gradients, SVG fills and chart
 * strokes. Values come from src/lib/tokens.js — the single source of truth
 * shared with `tailwind.config.js` (which drives className-based styling).
 */
import { colors } from './tokens';

export { colors, fontSize, borderRadius } from './tokens';

/**
 * Platform brand colors — the ONE source for twitter/instagram/linkedin/email
 * accents (imported by approval, profile, scheduler, index, demo).
 */
export const PLATFORM_COLORS = {
  twitter: colors.platform.twitter,
  instagram: colors.platform.instagram,
  linkedin: colors.platform.linkedin,
  email: colors.platform.email,
} as const;

export const palette = {
  white: '#FFFFFF',
} as const;

/** Icon colours reused across the shell and pages. */
export const iconColor = {
  primary: colors.primary[600],
  active: colors.primary[300],
  muted: colors.ink.faint,
  subtle: colors.ink.subtle,
  inverse: palette.white,
  danger: colors.danger.DEFAULT,
  success: colors.success.DEFAULT,
  warning: colors.warning.DEFAULT,
} as const;
