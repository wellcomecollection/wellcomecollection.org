// @flow
import {london} from './format-date';
import type {DateRange} from '../model/date-range';

export function getEarliestFutureDateRange(dateRanges: DateRange[]): ?DateRange {
  return dateRanges
    .sort((a, b) => a.start - b.start)
    .find(range => range.start > london().toDate());
}

export function isPast(date: Date): boolean {
  return london(date).isBefore(london());
}

export function getNextWeekendDateRange(date: Date): DateRange {
  const today = london(date);
  const todayInteger = today.day(); // day() return Sun as 0, Sat as 6

  const start = todayInteger !== 0 ? london(today).day(5) : london(today).day(-2); ;
  const end = todayInteger === 0 ? london(today) : london(today).day(7);

  return {
    start: start.toDate(),
    end: end.toDate()
  };
}
