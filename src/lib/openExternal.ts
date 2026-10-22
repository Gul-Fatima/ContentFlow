import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

/**
 * Opening Stripe's hosted pages.
 *
 * Checkout is an auth session on native so Stripe can bounce the customer back
 * into the app; the Billing Portal is a plain browser tab (users finish there
 * and come back on their own). Web always navigates the current tab.
 */

/** The web origin, or the app's deep-link base on native. */
function returnBase(): string {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    return window.location.origin;
  }
  return Linking.createURL('');
}

/**
 * Convert an incoming deep link (`agentai://billing/success?session_id=…`,
 * `exp://host:8081/--/billing/success`) into an expo-router path. Returns null
 * for anything that isn't one of our own links, so a redirect can never push
 * the app to an arbitrary origin.
 */
export function appPathFromUrl(url: string): string | null {
  const base = returnBase();
  const isOurs =
    url.startsWith(base) ||
    url.startsWith('agentai://') ||
    (typeof __DEV__ !== 'undefined' && __DEV__ && url.startsWith('exp://'));
  if (!isOurs) return null;

  const parsed = Linking.parse(url);
  const path = (parsed.path ?? '').replace(/^\/+/, '');
  if (!path) return null;

  const search = new URLSearchParams();
  Object.entries(parsed.queryParams ?? {}).forEach(([key, value]) => {
    if (typeof value === 'string' && value) search.append(key, value);
  });
  const query = search.toString();
  return `/${path}${query ? `?${query}` : ''}`;
}

/**
 * Open Stripe Checkout. On native the promise resolves when the user returns;
 * a successful return is routed to the app screen it points at, while a
 * dismissal does nothing (the Review modal stays where it was).
 */
export async function openCheckout(url: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.location.assign(url);
    return;
  }

  const result = await WebBrowser.openAuthSessionAsync(url, returnBase());
  if (result.type === 'success' && result.url) {
    const path = appPathFromUrl(result.url);
    if (path) router.navigate(path as never);
  }
}

/** Open the Stripe Billing Portal in a browser tab (or the current tab on web). */
export async function openBillingPortal(url: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.location.assign(url);
    return;
  }
  await WebBrowser.openBrowserAsync(url);
}

/** Open any external link (e.g. a Stripe hosted invoice) in a new tab. */
export async function openInBrowser(url: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    return;
  }
  await WebBrowser.openBrowserAsync(url);
}
