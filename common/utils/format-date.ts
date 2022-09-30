function formatLondon(date: Date, options: Intl.DateTimeFormatOptions): string {
  return date.toLocaleString('en-GB', {
    ...options,
    timeZone: 'Europe/London',
  });
}

/** Formats a date as the day of the week, e.g. 'Monday', 'Tuesday'. */
export function formatDay(date: Date): string {
  return formatLondon(date, { weekday: 'long' });
}

/** Formats a date as the day of the week, plus the day of the month and the name of the month.
 *
 * e.g. 'Thursday 29 September'
 */
export function formatDayDate(date: Date): string {
  return `${formatDay(date)} ${formatDate(date)}`;
}

/** Formats a date as the day of the month, the name of the month, and the year.
 *
 * e.g. '29 September 2022'
 */
export function formatDate(date: Date): string {
  return `${formatDayMonth(date)} ${formatYear(date)}`;
}

/** Formats a date as the HH:MM time, using a 24-hour clock, e.g. '09:00' or '13:30' */
export function formatTime(date: Date): string {
  const hours = formatLondon(date, { hour: '2-digit', hourCycle: 'h23' });
  const minutes = formatLondon(date, { minute: '2-digit' }).padStart(2, '0');

  return `${hours}:${minutes}`;
}

/** Formats a date as the year, e.g. '2022' */
export function formatYear(date: Date): string {
  return formatLondon(date, { year: 'numeric' });
}

/** Formats a date as the day of the month and the month, e.g. '29 September' */
export function formatDayMonth(date: Date): string {
  const day = formatLondon(date, { day: 'numeric' });
  const month = formatLondon(date, { month: 'long' });

  return `${day} ${month}`;
}

/** Formats a duration as HH:MM:SS, e.g. '01:02:03' is 1 hour, 2 minutes, 3 seconds. */
export function formatDuration(seconds: number): string {
  const secondsPerMinute = 60;
  const secondsPerHour = 60 * secondsPerMinute;

  const hours = Math.floor(seconds / secondsPerHour);
  const minutes = Math.floor((seconds % secondsPerHour) / secondsPerMinute);
  const remainingSeconds = seconds % secondsPerMinute;

  console.assert(
    hours * secondsPerHour + minutes * secondsPerMinute + remainingSeconds ===
      seconds,
    `${hours ** secondsPerHour + minutes * secondsPerMinute} != ${seconds}`
  );

  const HH = String(hours).padStart(2, '0');
  const MM = String(minutes).padStart(2, '0');
  const SS = String(remainingSeconds).padStart(2, '0');

  return `${HH}:${MM}:${SS}`;
}
