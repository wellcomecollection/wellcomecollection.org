import { format, isSameDay, sub } from 'date-fns';
import moment, { Moment } from 'moment';
import 'moment-timezone';
import { isDayPast } from './dates';
import { DateRange } from '../model/date-range';

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

// Returns the time, e.g. '17:21'
export function formatTime(date: Date): string {
  return format(date, 'HH:mm');
}

// Returns the year, e.g. '2022'
export function formatYear(date: Date): string {
  return format(date, 'yyyy');
}

// Returns the day and the month, e.g. '14 March'
export function formatDayMonth(date: Date): string {
  return format(date, 'd MMMM');
}

// Returns the date as a spelled out string, e.g. '27 April 2009'
export function formatDate(date: Date): string {
  return `${formatDayMonth(date)} ${formatYear(date)}`;
}

export function formatDateRangeWithMessage({ start, end }: DateRange): {
  text: string;
  color: string;
} {
  const now = new Date();
  const sevenDaysBeforeEnd = sub(end, { days: 7 });

  if (!isSameDay(start, now) && start > now) {
    return { text: 'Coming soon', color: 'marble' };
  } else if (isDayPast(end)) {
    return { text: 'Past', color: 'marble' };
  } else if (
    sevenDaysBeforeEnd <= now ||
    isSameDay(sevenDaysBeforeEnd, now) ||
    isSameDay(end, now)
  ) {
    return { text: 'Final week', color: 'orange' };
  } else {
    return { text: 'Now on', color: 'green' };
  }
}
