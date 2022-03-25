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

function createFormatter(options: Intl.DateTimeFormatOptions) {
  const formatter = new Intl.DateTimeFormat('en-GB', options);
  const f = (date: Date) => formatter.format(date).replace(', ', ' ');
  return f;
}

// e.g. "Tuesday"
export const formatDay = createFormatter({ weekday: 'long' });

// e.g. "Friday 25 March 2022"
export const formatDayDate = createFormatter({
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// e.g. "Saturday 28 August 2021"
export const formatDate = createFormatter({
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// e.g. "14:02"
export const formatTime = createFormatter({
  hour: 'numeric',
  minute: 'numeric',
  hour12: false,
});

// e.g. "2019"
export const formatYear = createFormatter({ year: 'numeric' });

// e.g. "8 July"
export const formatDayMonth = createFormatter({
  month: 'long',
  day: 'numeric',
});

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
