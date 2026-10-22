/** Display formatting shared by pricing, plan card and billing history. */

/**
 * Whole dollars lose the trailing `.00` (`$29`), cents keep two decimals
 * (`$278.40`, `$23.17`).
 */
export function formatCents(cents: number): string {
  const safe = Number.isFinite(cents) ? Math.round(cents) : 0;
  const dollars = safe / 100;
  return Number.isInteger(dollars) ? `$${dollars}` : `$${dollars.toFixed(2)}`;
}

/** "USD" + cents -> "$79.00" (always two decimals: invoice amounts). */
export function formatCurrency(cents: number, currency: string): string {
  const amount = (Number.isFinite(cents) ? cents : 0) / 100;
  const code = (currency || 'usd').toUpperCase();
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
    }).format(amount);
  } catch {
    return `${code} ${amount.toFixed(2)}`;
  }
}

/** "2026-02-27T…" -> "Feb 27, 2026"; unparseable input -> ''. */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** 200 -> "200", null -> "Unlimited", 10000 -> "10,000". */
export function formatLimit(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'Unlimited';
  return value.toLocaleString('en-US');
}
