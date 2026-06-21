/**
 * Centralized date formatting utilities.
 *
 * The `locale` defaults to a FIXED value ("en-US") rather than the runtime
 * default so server and client render identically — otherwise SSR hydration
 * mismatches occur when the Node server's locale differs from the browser's.
 * Pass an explicit locale (e.g. the user's) for localized output.
 */

type DateInput = string | number | Date;

const DEFAULT_LOCALE = "en-US";

function toDate(input: DateInput): Date {
  return input instanceof Date ? input : new Date(input);
}

/** "Jan 5, 2026" */
export function formatDate(input: DateInput, locale: string = DEFAULT_LOCALE): string {
  return toDate(input).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** "Jan 5, 2026, 3:45 PM" */
export function formatDateTime(input: DateInput, locale: string = DEFAULT_LOCALE): string {
  return toDate(input).toLocaleString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "Jan 5" */
export function formatShortDate(input: DateInput, locale: string = DEFAULT_LOCALE): string {
  return toDate(input).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
}

/** "January 5, 2026" */
export function formatLongDate(input: DateInput, locale: string = DEFAULT_LOCALE): string {
  return toDate(input).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
