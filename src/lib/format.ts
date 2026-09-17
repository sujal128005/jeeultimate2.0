const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(iso: string) {
  return dateFormatter.format(new Date(iso));
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

export function formatPrice(rupees: number) {
  return `₹${new Intl.NumberFormat("en-IN").format(rupees)}`;
}

/* Calendar dates: parsed as local calendar days (no time zone drift). */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-06-13" → day number since epoch (UTC based, stable everywhere). */
export function dayIndex(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

export function isoFromDayIndex(index: number) {
  return new Date(index * 86400000).toISOString().slice(0, 10);
}

/** "13 Jun" */
export function formatDay(iso: string) {
  const [, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}`;
}

/** "13 Jun", "13–26 Jun" or "30 Jun – 3 Jul" (en dashes, never em dashes) */
export function formatRange(start: string, end?: string) {
  if (!end || end === start) return formatDay(start);
  const [, sm, sd] = start.split("-").map(Number);
  const [, em, ed] = end.split("-").map(Number);
  return sm === em ? `${sd}–${ed} ${MONTHS[em - 1]}` : `${formatDay(start)} – ${formatDay(end)}`;
}
