// @flow
import {Predicates} from 'prismic-javascript';
import {london} from '../../utils/format-date';
import {getNextWeekendDateRange} from '../../utils/dates';

export type DateRangeString =
  | 'today'
  | 'this-weekend'
  | 'current-and-coming-up'
  | 'past'
  | 'current'
  | 'coming-up'
  | 'this-weekend'
  | 'this-week';
export function getDateRangePredicatesFromString(
  rangeString: ?DateRangeString,
  startField: string,
  endField: string
): Predicates[] {
  const now = london();
  const startOfDay = now.startOf('day');
  const endOfDay = now.endOf('day');
  const weekendDateRange = getNextWeekendDateRange(now);
  // TODO: this-week
  console.info(rangeString);
  const range =
    rangeString === 'current' ? [
      Predicates.dateBefore(startField, endOfDay.toDate()),
      Predicates.dateAfter(endField, endOfDay.toDate())
    ] : rangeString === 'coming-up' ? [
      Predicates.dateAfter(startField, startOfDay.toDate())
    ] : rangeString === 'current-and-coming-up' ? [
      Predicates.dateAfter(endField, endOfDay.toDate())
    ] : rangeString === 'past' ? [
      Predicates.dateBefore(endField, endOfDay.toDate())
    ] : rangeString === 'today' ? [
      Predicates.dateBefore(startField, startOfDay.toDate()),
      Predicates.dateAfter(endField, startOfDay.toDate())
    ] : rangeString === 'this-weekend' ? [
      Predicates.dateAfter(startField, london(weekendDateRange.start).startOf('day')),
      Predicates.dateBefore(startField, london(weekendDateRange.end).endOf('day'))
    ] : rangeString === 'this-week' ? [
      Predicates.dateAfter(startField, now.startOf('week')),
      Predicates.dateBefore(startField, now.endOf('week'))
    ] : [];

  return range;
}
