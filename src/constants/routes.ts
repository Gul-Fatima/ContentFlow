export const ROUTES = {
  home: '/',
  demo: '/demo',
  signIn: '/sign-in',
  signUp: '/sign-up',
  dashboard: '/dashboard',
  approval: '/approval',
  scheduler: '/scheduler',
  memory: '/memory',
  brandSetup: '/brand-setup',
  analytics: '/analytics',
  notifications: '/notifications',
  pricing: '/pricing',
  profile: '/profile',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
