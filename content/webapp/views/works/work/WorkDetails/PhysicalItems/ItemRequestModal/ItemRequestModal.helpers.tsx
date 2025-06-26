// This serialises a date to/from the format DD-MM-YYYY,
// e.g. 14-09-2022.
export function dateAsValue(d: Date): string {
  const days = d.getUTCDate().toString().padStart(2, '0');
  const months = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  const years = d.getUTCFullYear().toString();

  return `${days}-${months}-${years}`;
}

export function dateFromValue(s: string): Date {
  const days = s.slice(0, 2);
  const months = s.slice(3, 5);
  const years = s.slice(6, 10);

  // We want to make sure we get a UTC timestamp here, and aren't
  // affected by the user's timezone.
  return new Date(`${years}-${months}-${days}T00:00:00Z`);
}

// Formats a date as YYYY-MM-DD, e.g. 2022-09-21
export function formatDateForRequestsAPI(d: Date): string {
  const years = d.getUTCFullYear().toString();
  const months = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  const days = d.getUTCDate().toString().padStart(2, '0');

  return `${years}-${months}-${days}`;
}
