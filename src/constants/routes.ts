export const ROUTES = {
  /** Entry gate: resolves to /dashboard or /welcome based on the session. */
  home: '/',
  landing: '/landing',
  welcome: '/welcome',
  onboarding: '/onboarding',
  forgotPassword: '/forgot-password',
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
