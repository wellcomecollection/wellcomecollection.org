import { DateTypes, london } from './format-date';
import { DateRange } from '../model/date-range';
import { isSameDay } from 'date-fns';

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

// Returns true if 'date' falls on a past day; false otherwise.
//
// Note: this means it will return true if `date` falls on an earlier time
// today, e.g. isDayPast(09:00) called at 12:00 on the same day will be true.
export function isDayPast(date: Date): boolean {
  const now = new Date();
  return isSameDay(date, now) || date < now;
}

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
