import moment, { Moment } from 'moment';
import 'moment-timezone';

type DateObj = { M?: number; Y?: number };

export type DateTypes = Date | string | Moment | DateObj;

export function london(d?: DateTypes): Moment {
  return moment.tz(d, 'Europe/London');
}

export function londonFromFormat(d: DateTypes, format: string): Moment {
  return moment(d, format).tz('Europe/London');
}

export function formatDay(date: Date | Moment): string {
  return london(date).format('dddd');
}

export function formatDayDate(date: Date | Moment): string {
  return london(date).format('dddd D MMMM YYYY');
}

export function formatDate(date: Date | Moment): string {
  return london(date).format('D MMMM YYYY');
}

export function formatTime(date: DateTypes): string {
  return london(date).format('HH:mm');
}

export function formatDateRangeWithMessage({
  start,
  end,
}: {
  start: Date;
  end: Date;
}): { text: string; color: string } {
  const now = london();
  const s = london(start);
  const e = london(end);

  if (s.isAfter(now, 'day')) {
    return { text: 'Coming soon', color: 'marble' };
  } else if (e.isBefore(now, 'day')) {
    return { text: 'Past', color: 'marble' };
  } else if (
    now.isBetween(e.clone().subtract(1, 'w'), e, 'day') ||
    e.isSame(now, 'day')
  ) {
    return { text: 'Final week', color: 'orange' };
  } else {
    return { text: 'Now on', color: 'green' };
  }
}

export function formatYear(date: Date): string {
  return london(date).format('YYYY');
}

export function formatDayMonth(date: Date): string {
  return london(date).format('D MMMM');
}
