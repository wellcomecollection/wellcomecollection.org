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
import { formatIso8601Date } from '@weco/common/utils/format-date';

type Props = { period?: Period; startField: string; endField: string };
export const getEventPredicates = ({
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

export const getExhibitionPeriodPredicates = ({
  period,
  startField,
  endField,
}: Props): string[] => {
  // This function relies heavily on Prismic's date predicates, which are
  // described in the API documentation here:
  // https://prismic.io/docs/rest-api-technical-reference#date-predicates
  //
  // Note in particular this line:
  //
  //      The "after" and "before" predicates will not include a date or time
  //      equal to the given value.
  //

  const now = today();

  const yesterday = addDays(today(), -1);
  const tomorrow = addDays(today(), 1);

  const weekendDateRange = getNextWeekendDateRange(now);

  switch (period) {
    case 'current-and-coming-up':
      // yesterday < endDate and yesterday != endDate
      // ⇔
      // today <= endDate
      return [predicate.dateAfter(endField, formatIso8601Date(yesterday))];

    case 'past':
      // endDate < today and endDate != today
      return [predicate.dateBefore(endField, formatIso8601Date(today()))];

    case 'coming-up':
      // today < startDate and today != startDate
      return [predicate.dateAfter(startField, formatIso8601Date(today()))];

    case 'today':
      return [
        // startDate < tomorrow and startDate != tomorrow
        // ⇔
        // startDate <= today
        predicate.dateBefore(startField, formatIso8601Date(tomorrow)),

        // yesterday < endDate and yesterday != endDate
        // ⇔
        // today <= endDate
        predicate.dateAfter(endField, formatIso8601Date(yesterday)),
      ];

    case 'this-weekend':
      return [
        predicate.dateBefore(
          startField,
          formatIso8601Date(addDays(weekendDateRange.end, 1))
        ),
        predicate.dateAfter(
          endField,
          formatIso8601Date(addDays(weekendDateRange.start, -1))
        ),
      ];

    case 'this-week':
      return [
        predicate.dateBefore(
          startField,
          formatIso8601Date(addDays(endOfWeek(now), 1))
        ),
        predicate.dateAfter(
          endField,
          formatIso8601Date(addDays(startOfWeek(now), -1))
        ),
      ];

    case 'next-seven-days':
      return [
        predicate.dateBefore(
          startField,
          formatIso8601Date(addDays(today(), 7))
        ),
        predicate.dateAfter(endField, formatIso8601Date(yesterday)),
      ];

    // This branch should be unreachable by the types on Period, but we include
    // it for safety and so that TypeScript is happy with the return type.
    default:
      console.warn(`Got unrecognised period: ${period}`);
      return [];
  }
};

export const isOnlinePredicate = predicate.at('my.events.isOnline', 'true');

export const availableOnlinePredicate = predicate.at(
  'my.events.availableOnline',
  'true'
);
