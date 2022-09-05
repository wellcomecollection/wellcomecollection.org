import moment from 'moment';
import { predicate } from '@prismicio/client';
import { getNextWeekendDateRange } from '@weco/common/utils/dates';
import { london } from '@weco/common/utils/format-date';
import { Period } from '../../../types/periods';

type Props = { period?: Period; startField: string; endField: string };
export const getPeriodPredicates = ({
  period,
  startField,
  endField,
}: Props): string[] => {
  const now = london(new Date());
  const startOfDay = moment().startOf('day');
  const endOfDay = moment().endOf('day');
  const weekendDateRange = getNextWeekendDateRange(now.toDate());
  const predicates =
    period === 'coming-up'
      ? [predicate.dateAfter(startField, endOfDay.toDate())]
      : period === 'current-and-coming-up'
      ? [predicate.dateAfter(endField, startOfDay.toDate())]
      : period === 'past'
      ? [predicate.dateBefore(endField, startOfDay.toDate())]
      : period === 'today'
      ? [
          predicate.dateBefore(startField, endOfDay.toDate()),
          predicate.dateAfter(endField, startOfDay.toDate()),
        ]
      : period === 'this-weekend'
      ? [
          predicate.dateBefore(startField, weekendDateRange.end),
          predicate.dateAfter(endField, weekendDateRange.start),
        ]
      : period === 'this-week'
      ? [
          predicate.dateBefore(startField, now.endOf('week').toDate()),
          predicate.dateAfter(startField, now.startOf('week').toDate()),
        ]
      : period === 'next-seven-days'
      ? [
          predicate.dateBefore(
            startField,
            now.add(6, 'days').endOf('day').toDate()
          ),
          predicate.dateAfter(endField, startOfDay.toDate()),
        ]
      : [];

  return predicates;
};

export const isOnlinePredicate = predicate.at('my.events.isOnline', 'true');

export const availableOnlinePredicate = predicate.at(
  'my.events.availableOnline',
  'true'
);
