import { DateRange } from '@weco/common/model/date-range';

import { formatDayDate } from './format-date';

/** Returns the current date/time.
 *
 * We use this function rather than calling `new Date()` directly for two reasons:
 *
 *    1.  In tests, you can override the return value of this function in a single test
 *        using the `mockToday()` helper, for example:
 *
 *            import mockToday from '@weco/common/test/utils/date-mocks';
 *
 *            mockToday({ as: new Date('2021-10-30') });
 *
 *        Within the context of this test, any code that calls `today()` will be told
 *        that the current date is 30 October 2021.
 *
 *    2.  In local development, you can override the return value of this function to
 *        make the site think it's a different date.
 *
 *        e.g. if you have this function return a date that's a week in the future, you'll
 *        see how the opening times render on that day.
 *
 */
export function today(): Date {
  return new Date();
}

export function isPast(date: Date): boolean {
  return date < today();
}

export function isFuture(date: Date): boolean {
  return date > today();
}

/** Returns true if `date1` is on the same day as `date2`, false otherwise.
 *
 * This compares the dates in London, not UTC.  See the tests for examples
 * of edge cases where there are different UTC days but this function still
 * returns true.
 *
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return formatDayDate(date1) === formatDayDate(date2);
}

/** Returns true if `date1` is on the same day or before `date2`,
 * false otherwise.
 *
 * This compares the dates in London, not UTC.  See the tests for examples
 * of edge cases where there are different UTC days but this function still
 * returns true.
 *
 * Note: the order of arguments to this function is designed so you can
 * concatenate them and get sensible-looking results.
 *
 *    isSameDayOrBefore(A, B) && isSameDayOrBefore(B, C)
 *      => isSameDayOrBefore(A, C)
 *
 * (The fancy term is "transitive".)
 *
 */
export function isSameDayOrBefore(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2) || date1 <= date2;
}

type LondonTZ = 'GMT' | 'BST';

/** Returns the current timezone in London. */
export function getLondonTimezone(d: Date): LondonTZ {
  const s = d.toLocaleString('en-GB', {
    hour: '2-digit',
    timeZoneName: 'short',
    timeZone: 'Europe/London',
  });

  if (s.endsWith(' BST')) {
    return 'BST';
  } else if (s.endsWith(' GMT')) {
    return 'GMT';
  } else {
    throw new Error(`Unrecognised London timezone in ${s}`);
  }
}

/** Returns the start of the day (midnight) in London. */
export function startOfDay(d: Date): Date {
  const res = new Date(d);

  if (getLondonTimezone(d) === 'BST') {
    if (res.getUTCHours() >= 23) {
      res.setUTCHours(23, 0, 0, 0);
    } else {
      res.setUTCHours(-1, 0, 0, 0);
    }
  } else {
    res.setUTCHours(0, 0, 0, 0);
  }

  return res;
}

/** Returns the end of the day (a second before midnight) in London. */
export function endOfDay(d: Date): Date {
  const res = new Date(d);

  if (getLondonTimezone(d) === 'BST') {
    if (res.getUTCHours() >= 23) {
      res.setDate(res.getDate() + 1);
    }

    res.setUTCHours(22, 59, 59, 999);
  } else {
    res.setUTCHours(23, 59, 59, 999);
  }

  return res;
}

export function addDays(d: Date, days: number): Date {
  const res = new Date(d);
  res.setDate(res.getDate() + days);
  return res;
}

/** Finds the start and end of the week.
 *
 * For the purposes of these two functions, weeks start on a Sunday.
 *
 */
export function startOfWeek(d: Date): Date {
  return addDays(d, -d.getDay());
}

export function endOfWeek(d: Date): Date {
  return addDays(d, 6 - d.getDay());
}

/** Returns a loose range of Friday–Sunday for the next weekend after the
 * given date, possibly including it.
 *
 * Note: including Friday seems like a slightly odd choice, but it's the way
 * this function was originally written. ¯\_ (ツ)_/¯
 */
export function getNextWeekendDateRange(date: Date): DateRange {
  const dayInteger = date.getDay(); // getDay() return Sun as 0, Sat as 6
  const todayIsSunday = dayInteger === 0;

  const start = todayIsSunday
    ? addDays(date, -2)
    : addDays(date, 5 - dayInteger);
  const end = addDays(start, 2);

  return {
    start: startOfDay(start),
    end: endOfDay(end),
  };
}

/** Returns an array containing all the dates between `start` and `end`.
 *
 * e.g. getDatesBetween({ start: new Date(2001-01-01), end: new Date(2001-01-04) })
 *          => [2001-01-01, 2001-01-02, 2001-01-03, 2001-04-01]
 *
 */
export function getDatesBetween({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}): Date[] {
  const dateArray: Date[] = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    dateArray.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }
  return dateArray;
}

export function countDaysBetween(a: Date, b: Date): number {
  const millisecondsInDay = 1000 * 60 * 60 * 24;
  return Math.floor((a.valueOf() - b.valueOf()) / millisecondsInDay);
}

/** Returns the earliest date from a list. */
export function minDate(dates: Date[]): Date | undefined {
  return dates.reduce<Date | undefined>(
    (a, b) => (a === undefined ? b : a < b ? a : b),
    undefined
  );
}

/** Returns the latest date from a list. */
export function maxDate(dates: Date[]): Date | undefined {
  return dates.reduce<Date | undefined>(
    (a, b) => (a === undefined ? b : a > b ? a : b),
    undefined
  );
}
