/**
 * Design tokens — the single source of truth for color / font-size / radius.
 * Consumed by tailwind.config.js (className tokens) and src/lib/theme.ts
 * (raw values for icon colors, placeholders, gradients, charts).
 * Figma is the source of truth; the old brand/cream/peach/brown palette is retired.
 */

const colors = {
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
  },
  sidebar: { DEFAULT: '#0F172A', card: '#1E293B', track: '#334155' },
  surface: {
    page: '#F8FAFC',
    card: '#FFFFFF',
    muted: '#F1F5F9',
    border: '#E2E8F0',
  },
  ink: {
    DEFAULT: '#0F172A',
    muted: '#475569',
    subtle: '#64748B',
    faint: '#94A3B8',
    placeholder: '#94A3B8',
  },
  success: { DEFAULT: '#059669', soft: '#D1FAE5', text: '#047857' },
  danger: { DEFAULT: '#E11D48', soft: '#FFE4E6', text: '#BE123C' },
  warning: { DEFAULT: '#D97706', soft: '#FEF3C7', text: '#B45309' },
  platform: {
    twitter: '#0EA5E9',
    instagram: '#DB2777',
    linkedin: '#1D4ED8',
    email: '#64748B',
  },
  // Decorative / chart colors with no Figma text-surface token yet.
  chart: {
    c1: '#FDE047', // analytics insight bulb
    c2: '#34D399', // landing ROI tracking
    c3: '#FBBF24', // landing testimonial stars
    c4: '#F472B6', // landing cross-platform sync
    c5: '#FB7185', // scheduler delete action
  },
  // One-off accents: links, comment icon, platform chip tints.
  accent: {
    link: '#0284C7',
    comment: '#2563EB',
    'comment-soft': '#DBEAFE',
    'twitter-soft': '#F0F9FF',
    'twitter-border': '#BAE6FD',
    'instagram-soft': '#FDF2F8',
    'instagram-border': '#FBCFE8',
    'linkedin-soft': '#EFF6FF',
    'linkedin-border': '#BFDBFE',
  },
};

const fontSize = {
  caption: ['11px', { lineHeight: '16px' }],
  xs: ['12px', { lineHeight: '16px' }],
  sm: ['14px', { lineHeight: '20px' }],
  base: ['16px', { lineHeight: '24px' }],
  lg: ['18px', { lineHeight: '28px' }],
  xl: ['20px', { lineHeight: '28px' }],
  '2xl': ['24px', { lineHeight: '32px' }],
  '3xl': ['30px', { lineHeight: '36px' }],
  '4xl': ['36px', { lineHeight: '40px' }],
};

const borderRadius = { control: '8px', card: '12px', pill: '9999px' };

module.exports = { colors, fontSize, borderRadius };
