// @flow
import moment from 'moment';
import {Predicates} from 'prismic-javascript';
import {london} from '../../utils/format-date';
import {getNextWeekendDateRange} from '../../utils/dates';

export type DateRangeString =
  | 'today'
  | 'this-weekend'
  | 'current-and-coming-up'
  | 'past'
  | 'coming-up'
  | 'this-week';
export function getDateRangePredicatesFromString(
  rangeString: ?DateRangeString,
  startField: string,
  endField: string
): Predicates[] {
  const now = london(new Date());
  const startOfDay = moment().startOf('day');
  const endOfDay = moment().endOf('day');
  const weekendDateRange = getNextWeekendDateRange(now);

  const range =
    rangeString === 'coming-up' ? [
      Predicates.dateAfter(startField, startOfDay.toDate())
    ] : rangeString === 'current-and-coming-up' ? [
      Predicates.dateAfter(endField, endOfDay.toDate())
    ] : rangeString === 'past' ? [
      Predicates.dateBefore(endField, startOfDay.toDate())
    ] : rangeString === 'today' ? [
      Predicates.dateBefore(startField, endOfDay.toDate()),
      Predicates.dateAfter(endField, startOfDay.toDate())
    ] : rangeString === 'this-weekend' ? [
      Predicates.dateBefore(startField, weekendDateRange.end),
      Predicates.dateAfter(endField, weekendDateRange.start)
    ] : rangeString === 'this-week' ? [
      Predicates.dateBefore(startField, now.endOf('week')),
      Predicates.dateAfter(startField, now.startOf('week'))
    ] : [];

  return range;
}
