export const ROUTES = {
  /** Entry gate: resolves to /dashboard or /welcome based on the session. */
  home: '/',
  landing: '/landing',
  welcome: '/welcome',
  onboarding: '/onboarding',
  forgotPassword: '/forgot-password',
  terms: '/legal/terms',
  privacy: '/legal/privacy',
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
  /** Post-Checkout screens inside (app); both verify state with the backend. */
  billingSuccess: '/billing/success',
  billingCancel: '/billing/cancel',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
