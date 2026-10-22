const eventDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
export function formatEventDates(start: string, end: string) {
  // Node and browser ICU versions use different spacing around date ranges.
  // Normalize Unicode spaces so server markup and hydration agree.
  return eventDate.formatRange(
    new Date(`${start}T00:00:00Z`),
    new Date(`${end}T00:00:00Z`),
  ).replace(/[\u00a0\u2009\u202f]/g, " ");
}
