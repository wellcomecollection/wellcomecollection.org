// @flow
import moment from 'moment';
import {Predicates} from 'prismic-javascript';
import {london} from '../../utils/format-date';
import {getNextWeekendDateRange} from '../../utils/dates';
import type {Period} from '../../model/periods';

export function getPeriodPredicates(
  period: ?Period,
  startField: string,
  endField: string
): Predicates[] {
  const now = london(new Date());
  const startOfDay = moment().startOf('day');
  const endOfDay = moment().endOf('day');
  const weekendDateRange = getNextWeekendDateRange(now);

  const predicates =
    period === 'coming-up' ? [
      Predicates.dateAfter(startField, startOfDay.toDate())
    ] : period === 'current-and-coming-up' ? [
      Predicates.dateAfter(endField, endOfDay.toDate())
    ] : period === 'past' ? [
      Predicates.dateBefore(endField, startOfDay.toDate())
    ] : period === 'today' ? [
      Predicates.dateBefore(startField, endOfDay.toDate()),
      Predicates.dateAfter(endField, startOfDay.toDate())
    ] : period === 'this-weekend' ? [
      Predicates.dateBefore(startField, weekendDateRange.end),
      Predicates.dateAfter(endField, weekendDateRange.start)
    ] : period === 'this-week' ? [
      Predicates.dateBefore(startField, now.endOf('week')),
      Predicates.dateAfter(startField, now.startOf('week'))
    ] : period === 'next-seven-days' ? [
      Predicates.dateBefore(startField, now.add(6, 'days').endOf('day').toDate()),
      Predicates.dateAfter(endField, startOfDay.toDate())
    ] : [];

  return predicates;
}
