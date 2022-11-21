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

  // The 'current-and-coming-up' and 'past' predicates should split
  // events into two segments -- every event/exhibition should match
  // exactly one of these.
  //
  // We use today() as the comparison value so events get removed from
  // the What's On page as soon as they're done -- otherwise we get
  // events appearing with a "Past" label in the event list.
  if (period === 'current-and-coming-up') {
    return [predicate.dateAfter(endField, today())];
  }
  if (period === 'past') {
    return [predicate.dateBefore(endField, today())];
  }

  const predicates =
    period === 'coming-up'
      ? [predicate.dateAfter(startField, endOfToday)]
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
