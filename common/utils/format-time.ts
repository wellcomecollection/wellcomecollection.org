export function secondsToHoursMinutesAndSeconds(s: number): string {
  const m = Math.floor(s / 60);
  const hours = Math.floor(m / 60);
  const seconds = s % 60;
  const minutes = m % 60;
  const padSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const padMinutes = minutes < 10 ? `0${minutes}:` : `${minutes}:`;
  const padHours = hours === 0 ? '' : hours < 10 ? `0${hours}:` : `${hours}:`;

  return `${padHours}${padMinutes}${padSeconds}`;
}
