import moment from 'moment';
import { predicate } from 'prismic-client-beta';
import { getNextWeekendDateRange } from '@weco/common/utils/dates';
import { london } from '@weco/common/utils/format-date';

const periods = [
  'coming-up',
  'current-and-coming-up',
  'past',
  'today',
  'this-weekend',
  'this-week',
  'next-seven-days',
] as const;
type Period = typeof periods[number];
export function isPeriod(val: any): val is Period {
  return val && periods.includes(val);
}

type Props = { period?: Period; startField: string; endField: string };
export const getPeriodPredicates = ({
  period,
  startField,
  endField,
}: Props): string[] => {
  const now = london(new Date());
  const startOfDay = moment().startOf('day');
  const endOfDay = moment().endOf('day');
  const weekendDateRange = getNextWeekendDateRange(now);
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
