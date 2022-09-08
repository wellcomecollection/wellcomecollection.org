import { formatLondon, formatYear } from '@weco/common/utils/format-date';

// This serialises a date to/from the format DD-MM-YYYY,
// e.g. 14-09-2022.
export function dateAsValue(d: Date): string {
  const days = formatLondon(d, { day: 'numeric' }).padStart(2, '0');
  const months = formatLondon(d, { month: 'numeric' }).padStart(2, '0');
  const years = formatYear(d);

  return `${days}-${months}-${years}`;
}

export function dateFromValue(s: string): Date {
  const days = Number(s.slice(0, 2));
  const months = Number(s.slice(3, 5));
  const years = Number(s.slice(6, 10));

  // We want to make sure we get a UTC timestamp here, and aren't
  // affected by the user's timezone.
  return new Date(`${years}-${months}-${days}T00:00:00Z`);
}
