/**
 * Raw palette values for the few places where Tailwind classes can't reach:
 * icon `color` props, gradients, SVG fills and chart strokes.
 * Keep in sync with `tailwind.config.js` — that file is the source of truth
 * for className-based styling.
 */
export const palette = {
  brand: {
    50: '#F7EAE0',
    100: '#F1E1D2',
    200: '#EBD2BB',
    300: '#D8B196',
    400: '#B98A6E',
    500: '#5E7C66',
    600: '#1D4533',
    700: '#173A2B',
    800: '#122E22',
    900: '#0D241B',
    950: '#081A12',
  },
  cream: '#F7EAE0',
  peach: '#F9D2BA',
  brown: '#5E3122',
  white: '#FFFFFF',
} as const;

/** Icon colours reused across the shell and pages. */
export const iconColor = {
  primary: palette.brand[600],
  active: palette.brand[300],
  muted: '#94A3B8', // slate-400
  subtle: '#64748B', // slate-500
  inverse: palette.white,
  danger: '#E11D48', // rose-600
  success: '#059669', // emerald-600
  warning: '#D97706', // amber-600
} as const;
