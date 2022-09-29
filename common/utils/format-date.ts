export function formatLondon(
  date: Date,
  options: Intl.DateTimeFormatOptions
): string {
  return date.toLocaleString('en-GB', {
    ...options,
    timeZone: 'Europe/London',
  });
}

export function formatDay(date: Date): string {
  return formatLondon(date, { weekday: 'long' });
}

export function formatDayDate(date: Date): string {
  return `${formatDay(date)} ${formatDate(date)}`;
}

export function formatDate(date: Date): string {
  return `${formatDayMonth(date)} ${formatYear(date)}`;
}

export function formatTime(date: Date): string {
  const hours = formatLondon(date, { hour: '2-digit', hourCycle: 'h23' });
  const minutes = formatLondon(date, { minute: '2-digit' }).padStart(2, '0');

  return `${hours}:${minutes}`;
}

export function formatYear(date: Date): string {
  return formatLondon(date, { year: 'numeric' });
}

export function formatDayMonth(date: Date): string {
  const day = formatLondon(date, { day: 'numeric' });
  const month = formatLondon(date, { month: 'long' });

  return `${day} ${month}`;
}

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
