const formatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
  formatMatcher: "basic",
  timeZone: "UTC",
});

export function getFormattedTimestamp(minute: number, timeResolution: number) {
  const date = new Date(minute * timeResolution * 60 * 1000);
  return formatter.format(date);
}
