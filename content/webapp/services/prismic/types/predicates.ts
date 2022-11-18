import { predicate } from '@prismicio/client';
import {
  addDays,
  endOfDay,
  endOfWeek,
  getNextWeekendDateRange,
  startOfDay,
  startOfWeek,
  today,
} from '@weco/common/utils/dates';
import { Period } from '../../../types/periods';

type Props = { period?: Period; startField: string; endField: string };
export const getPeriodPredicates = ({
  period,
  startField,
  endField,
}: Props): string[] => {
  const now = today();

  const startOfToday = startOfDay(now);
  const endOfToday = endOfDay(now);

  const weekendDateRange = getNextWeekendDateRange(now);
  const predicates =
    period === 'coming-up'
      ? [predicate.dateAfter(startField, endOfToday)]
      : period === 'current-and-coming-up'
      ? [predicate.dateAfter(endField, startOfToday)]
      : period === 'past'
      ? [predicate.dateBefore(endField, startOfToday)]
      : period === 'today'
      ? [
          predicate.dateBefore(startField, endOfToday),
          predicate.dateAfter(endField, startOfToday),
        ]
      : period === 'this-weekend'
      ? [
          predicate.dateBefore(startField, weekendDateRange.end),
          predicate.dateAfter(endField, weekendDateRange.start),
        ]
      : period === 'this-week'
      ? [
          predicate.dateBefore(startField, endOfWeek(now)),
          predicate.dateAfter(startField, startOfWeek(now)),
        ]
      : period === 'next-seven-days'
      ? [
          predicate.dateBefore(startField, endOfDay(addDays(now, 6))),
          predicate.dateAfter(endField, startOfToday),
        ]
      : [];

  return predicates;
};

export const isOnlinePredicate = predicate.at('my.events.isOnline', 'true');

export const availableOnlinePredicate = predicate.at(
  'my.events.availableOnline',
  'true'
);
