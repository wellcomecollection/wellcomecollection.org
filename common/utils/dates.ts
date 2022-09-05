import { DateTypes, london } from './format-date';
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
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth()
  );
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return isSameMonth(date1, date2) && date1.getDate() === date2.getDate();
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

/** Returns a loose range of Friday–Sunday for the next weekend after the
 * given date, possibly including it.
 *
 * Note: including Friday seems like a slightly odd choice, but it's the way
 * this function was originally written. ¯\_ (ツ)_/¯
 */
export function getNextWeekendDateRange(date: DateTypes): DateRange {
  const today = london(date);
  const todayInteger = today.day(); // day() return Sun as 0, Sat as 6

  const start =
    todayInteger !== 0 ? london(today).day(5) : london(today).day(-2);
  const end = todayInteger === 0 ? london(today) : london(today).day(7);

  return {
    start: start.startOf('day').toDate(),
    end: end.endOf('day').toDate(),
  };
}
