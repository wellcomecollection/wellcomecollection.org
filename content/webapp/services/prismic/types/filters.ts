import * as prismic from '@prismicio/client';

import { Period } from '@weco/common/types/periods';
import {
  addDays,
  endOfDay,
  endOfWeek,
  getNextWeekendDateRange,
  startOfDay,
  startOfWeek,
  today,
} from '@weco/common/utils/dates';
import { formatIso8601Date } from '@weco/common/utils/format-date';

type Props = { period?: Period; startField: string; endField: string };
export const getEventFilters = ({
  period,
  startField,
  endField,
}: Props): string[] => {
  const now = today();

  const startOfToday = startOfDay(now);
  const endOfToday = endOfDay(now);

  const weekendDateRange = getNextWeekendDateRange(now);

  switch (period) {
    // The 'current-and-coming-up' and 'past' filters should split
    // events into two segments -- every event/exhibition should match
    // exactly one of these.
    //
    // We use today() as the comparison value so events get removed from
    // the What's On page as soon as they're done -- otherwise we get
    // events appearing with a "Past" label in the event list.

    case 'current-and-coming-up':
      return [prismic.filter.dateAfter(endField, today())];

    case 'past':
      return [prismic.filter.dateBefore(endField, today())];

    case 'coming-up':
      return [prismic.filter.dateAfter(startField, endOfToday)];

    case 'today':
      return [
        prismic.filter.dateBefore(startField, endOfToday),
        prismic.filter.dateAfter(endField, startOfToday),
      ];

    case 'this-weekend':
      return [
        prismic.filter.dateBefore(startField, weekendDateRange.end),
        prismic.filter.dateAfter(endField, weekendDateRange.start),
      ];

    case 'this-week':
      return [
        prismic.filter.dateBefore(startField, endOfWeek(now)),
        prismic.filter.dateAfter(startField, startOfWeek(now)),
      ];

    case 'next-seven-days':
      return [
        prismic.filter.dateBefore(startField, endOfDay(addDays(now, 6))),
        prismic.filter.dateAfter(endField, startOfToday),
      ];

    // This branch should be unreachable by the types on Period, but we include
    // it for safety and so that TypeScript is happy with the return type.
    default:
      console.warn(`Got unrecognised period: ${period}`);
      return [];
  }
};

export const getExhibitionPeriodFilters = ({
  period,
  startField,
  endField,
}: Props): string[] => {
  // This function relies heavily on Prismic's date filters, which are
  // described in the API documentation here:
  // https://prismic.io/docs/rest-api-technical-reference#date-filters
  //
  // Note in particular this line:
  //
  //      The "after" and "before" filters will not include a date or time
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
      return [prismic.filter.dateAfter(endField, formatIso8601Date(yesterday))];

    case 'past':
      // endDate < today and endDate != today
      return [prismic.filter.dateBefore(endField, formatIso8601Date(today()))];

    case 'coming-up':
      // today < startDate and today != startDate
      return [prismic.filter.dateAfter(startField, formatIso8601Date(today()))];

    case 'today':
      return [
        // startDate < tomorrow and startDate != tomorrow
        // ⇔
        // startDate <= today
        prismic.filter.dateBefore(startField, formatIso8601Date(tomorrow)),

        // yesterday < endDate and yesterday != endDate
        // ⇔
        // today <= endDate
        prismic.filter.dateAfter(endField, formatIso8601Date(yesterday)),
      ];

    case 'this-weekend':
      return [
        prismic.filter.dateBefore(
          startField,
          formatIso8601Date(addDays(weekendDateRange.end, 1))
        ),
        prismic.filter.dateAfter(
          endField,
          formatIso8601Date(addDays(weekendDateRange.start, -1))
        ),
      ];

    case 'this-week':
      return [
        prismic.filter.dateBefore(
          startField,
          formatIso8601Date(addDays(endOfWeek(now), 1))
        ),
        prismic.filter.dateAfter(
          endField,
          formatIso8601Date(addDays(startOfWeek(now), -1))
        ),
      ];

    case 'next-seven-days':
      return [
        prismic.filter.dateBefore(
          startField,
          formatIso8601Date(addDays(today(), 7))
        ),
        prismic.filter.dateAfter(endField, formatIso8601Date(yesterday)),
      ];

    // This branch should be unreachable by the types on Period, but we include
    // it for safety and so that TypeScript is happy with the return type.
    default:
      console.warn(`Got unrecognised period: ${period}`);
      return [];
  }
};

export const isOnlineFilter = prismic.filter.at('my.events.isOnline', 'true');

export const availableOnlineFilter = prismic.filter.at(
  'my.events.availableOnline',
  'true'
);
