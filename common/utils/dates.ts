import { DateRange } from '../model/date-range';
import { formatDayDate } from './format-date';

// This is to allow us to mock values in tests, e.g.
//
//    import * as dateUtils from '@weco/common/utils/dates';
//
//    const spyOnToday = jest.spyOn(dateUtils, 'today');
//    spyOnToday.mockImplementation(() =>
//      new Date('2022-09-19T00:00:00Z')
//    );
//
// If you're doing local debugging, you can also override the return value
// to make the site think it's a different date, e.g. to test opening times.
// (Note: this may not affect all parts of the site.)
//
export function today(): Date {
  return new Date();
}

export function isPast(date: Date): boolean {
  return date < today();
}

export function isFuture(date: Date): boolean {
  return date > today();
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth()
  );
}

type ComparisonMode = 'UTC' | 'London';

/** Returns true if `date1` is on the same day as `date2`, false otherwise.
 *
 * Note: this function supports UTC or London comparisons.  We suspect we always
 * want London comparisons -- uses of this function should be examined and tested
 * to decide the correct behaviour, and updated as necessary.
 *
 * If we get to a point where every comparison uses London, we should delete the
 * mode argument and document that requirement explicitly.
 *
 * TODO: This should really be London-only.  See https://github.com/wellcomecollection/wellcomecollection.org/issues/9874
 */
export function isSameDay(
  date1: Date,
  date2: Date,
  mode: ComparisonMode
): boolean {
  if (mode === 'UTC') {
    return (
      isSameMonth(date1, date2) && date1.getUTCDate() === date2.getUTCDate()
    );
  } else {
    return formatDayDate(date1) === formatDayDate(date2);
  }
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
  return isSameDay(date1, date2, 'London') || date1 <= date2;
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
export function minDate(dates: Date[]): Date {
  console.assert(dates.length > 0);
  return dates.reduce((a, b) => (a < b ? a : b));
}

/** Returns the latest date from a list. */
export function maxDate(dates: Date[]): Date {
  console.assert(dates.length > 0);
  return dates.reduce((a, b) => (a > b ? a : b));
}
