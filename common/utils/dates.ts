import { DateRange } from '../model/date-range';

export function getEarliestFutureDateRange(
  dateRanges: DateRange[],
  fromDate: Date | undefined = new Date()
): DateRange | undefined {
  const now = new Date();

  return dateRanges
    .sort((a, b) => (a.start > b.start ? 1 : -1))
    .find(
      ({ end }) =>
        (isSameDay(end, fromDate) || end > fromDate) &&
        (isSameDay(end, now) || end > now)
    );
}

export function isPast(date: Date): boolean {
  const now = new Date();
  return date < now;
}

export function isFuture(date: Date): boolean {
  const now = new Date();
  return date > now;
}

export function isSameMonth(date1: Date, date2: Date): boolean {
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth()
  );
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return isSameMonth(date1, date2) && date1.getUTCDate() === date2.getUTCDate();
}

// Note: the order of arguments to this function is designed so you can
// concatenate them and get sensible-looking results.
//
//      isSameDayOrBefore(A, B) && isSameDayOrBefore(B, C)
//        => isSameDayOrBefore(A, C)
//
export function isSameDayOrBefore(date1: Date, date2: Date): boolean {
  return isSameDay(date1, date2) || date1 <= date2;
}

// Returns true if 'date' falls on a past day; false otherwise.
export function isDayPast(date: Date): boolean {
  const now = new Date();
  if (isSameDay(date, now) || date > now) {
    return false;
  } else {
    return true;
  }
}

// Returns the day before the current date
export function dayBefore(date: Date): Date {
  const prevDay = new Date(date);
  prevDay.setDate(date.getDate() - 1);
  return prevDay;
}

export function startOfDay(d: Date): Date {
  const res = new Date(d);
  res.setUTCHours(0, 0, 0, 0);
  return res;
}

export function endOfDay(d: Date): Date {
  const res = new Date(d);
  res.setUTCHours(23, 59, 59, 999);
  return res;
}

export function addDays(d: Date, days: number): Date {
  const res = new Date(d);
  res.setDate(res.getDate() + days);
  return res;
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
  start,
  end,
}: {
  start: Date;
  end: Date;
}): Date[] {
  const dateArray: Date[] = [];
  let currentDate = start;
  while (currentDate <= end) {
    dateArray.push(currentDate);
    currentDate = addDays(currentDate, 1);
  }
  return dateArray;
}
