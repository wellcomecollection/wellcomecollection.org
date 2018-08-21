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
