import { DateTypes, london } from './format-date';
import { DateRange } from '../model/date-range';
import { Moment } from 'moment';

export function getEarliestFutureDateRange(
  dateRanges: DateRange[],
  fromDate: Moment | undefined = london()
): DateRange | undefined {
  return dateRanges
    .sort((a, b) => a.start.getMilliseconds() - b.start.getMilliseconds())
    .find(
      range =>
        london(range.end).isSameOrAfter(fromDate, 'day') &&
        london(range.end).isSameOrAfter(london(), 'day')
    );
}

export function isPast(date: Date): boolean {
  const now = new Date();
  return date.getMilliseconds() < now.getMilliseconds();
}

export function isFuture(date: Date): boolean {
  const now = new Date();
  return date.getMilliseconds() > now.getMilliseconds();
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
