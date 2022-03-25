import moment, { Moment } from 'moment';
import 'moment-timezone';
import { isFuture, isPast, isSameDay } from './dates';

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

export function formatYear(date: Date): string {
  return london(date).format('YYYY');
}

export function formatDayMonth(date: Date): string {
  return london(date).format('D MMMM');
}

export function formatDateRangeWithMessage({
  start,
  end,
}: {
  start: Date;
  end: Date;
}): { text: string; color: string } {
  const today = new Date();

  const sevenDaysTime = new Date();
  sevenDaysTime.setDate(sevenDaysTime.getDate() + 7);

  const closesToday = isSameDay(end, today);
  const closesInSevenDays = today < end && end < sevenDaysTime;

  if (!isSameDay(today, start) && isFuture(start)) {
    return { text: 'Coming soon', color: 'marble' };
  } else if (!isSameDay(today, end) && isPast(end)) {
    return { text: 'Past', color: 'marble' };
  } else if (closesToday || closesInSevenDays) {
    return { text: 'Final week', color: 'orange' };
  } else {
    return { text: 'Now on', color: 'green' };
  }
}
