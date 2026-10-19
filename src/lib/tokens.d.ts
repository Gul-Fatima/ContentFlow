/**
 * Type declarations for src/lib/tokens.js (CommonJS).
 * Lets TypeScript import the JS token file without `allowJs`.
 */

export declare const colors: {
  primary: {
    50: string;
    100: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
  };
  sidebar: { DEFAULT: string; card: string; track: string };
  surface: { page: string; card: string; muted: string; border: string };
  ink: {
    DEFAULT: string;
    muted: string;
    subtle: string;
    faint: string;
    placeholder: string;
  };
  success: { DEFAULT: string; soft: string; text: string };
  danger: { DEFAULT: string; soft: string; text: string };
  warning: { DEFAULT: string; soft: string; text: string };
  platform: { twitter: string; instagram: string; linkedin: string; email: string };
  chart: { c1: string; c2: string; c3: string; c4: string; c5: string };
  accent: {
    link: string;
    comment: string;
    'comment-soft': string;
    'twitter-soft': string;
    'twitter-border': string;
    'instagram-soft': string;
    'instagram-border': string;
    'linkedin-soft': string;
    'linkedin-border': string;
  };
};

export declare const fontSize: Record<
  string,
  [string, { lineHeight: string }]
>;

export declare const borderRadius: {
  control: string;
  card: string;
  pill: string;
};
