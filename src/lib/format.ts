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
