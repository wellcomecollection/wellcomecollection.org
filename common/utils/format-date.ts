import { format } from 'date-fns';
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

// Returns the name of a day, e.g. 'Monday'
export function formatDay(date: Date): string {
  return format(date, 'EEEE');
}

// Returns the date with a day, e.g. 'Monday 21 March 2022'
export function formatDayDate(date: Date): string {
  return `${formatDay(date)} ${formatDate(date)}`;
}

// Returns the date as a spelled out string, e.g. '27 April 2009'
export function formatDate(date: Date): string {
  return format(date, 'd MMMM yyyy');
}

// Returns the time, e.g. '17:21'
export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
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
  } else if (now.isBetween(e.clone().subtract(1, 'w'), e, 'day')) {
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
