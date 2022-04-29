// Utilities for grouping events

import sortBy from 'lodash.sortby';
import {
  getEarliestFutureDateRange,
  isFuture,
  isSameDay,
  isSameMonth,
} from '@weco/common/utils/dates';
import { EventTime } from '../../types/events';

type HasTimes = {
  times: EventTime[];
};

// Note: here months are 0-indexed, to match the months used by the built-in
// JavaScript date type.
export type YearMonth = {
  year: number;
  month: number;
};

// Creates a label in the form YYYY-MM, e.g. "2001-02"
//
// Note: here months are 1-indexed, because this value is displayed in the UI and
// used to construct fragment URLs.
export function createLabel({ year, month }: YearMonth): string {
  return `${year}-${(month + 1).toString().padStart(2, '0')}`;
}

export function parseLabel(label: string): YearMonth {
  const year = parseInt(label.slice(0, 4), 10);
  const month = parseInt(label.slice(5, 7), 10);
  return { year, month };
}

export function startOf({ year, month }: YearMonth): Date {
  return new Date(year, month, 1);
}

// recursive - TODO: make tail recursive?
type StartEnd = { start: Date; end: Date };

export function getMonthsInDateRange(
  { start, end }: StartEnd,
  acc: YearMonth[] = []
): YearMonth[] {
  if (isSameMonth(start, end) || start <= end) {
    const yearMonth = {
      year: start.getFullYear(),
      month: start.getMonth(),
    };
    const newAcc = acc.concat(yearMonth);
    const newStart = startOf({
      ...yearMonth,
      month: yearMonth.month + 1,
    });
    return getMonthsInDateRange({ start: newStart, end }, newAcc);
  } else {
    return acc;
  }
}

// For each event, find the months that it spans.
export function findMonthsThatEventSpans<T extends HasTimes>(
  events: T[]
): {
  event: T;
  months: YearMonth[];
}[] {
  return events
    .filter(event => event.times.length > 0)
    .map(event => {
      const firstRange = event.times[0];
      const lastRange = event.times[event.times.length - 1];

      const start = firstRange.range.startDateTime;
      const end = lastRange.range.endDateTime;

      const months = getMonthsInDateRange({ start, end });
      return { event, months };
    });
}

// Key: a YYYY-MM month label like "2001-02"
// Value: a list of events that fall somewhere in this month
export function groupEventsByMonth<T extends HasTimes>(
  events: T[]
): Record<string, T[]> {
  return findMonthsThatEventSpans(events).reduce((acc, { event, months }) => {
    months.forEach(month => {
      // Only add if it has a time in the month that is the same or after today
      //
      // NOTE: this means a very long-running event wouldn't appear in the events
      // for a month, e.g. a Jan-Feb-Mar event wouldn't appear in the February events.
      // Do we have any such long-running events?  If so, this is probably okay.
      const hasDateInMonthRemaining = event.times.find(time => {
        const start = time.range.startDateTime;
        const end = time.range.endDateTime;

        const endsInMonth = isSameMonth(end, startOf(month));

        const startsInMonth = isSameMonth(start, startOf(month));

        const today = new Date();
        const isNotClosedYet = isSameDay(end, today) || isFuture(end);

        return (endsInMonth || startsInMonth) && isNotClosedYet;
      });
      if (hasDateInMonthRemaining) {
        const label = createLabel(month);

        if (!acc[label]) {
          acc[label] = [];
        }
        acc[label].push(event);
      }
    });
    return acc;
  }, {} as Record<string, T[]>);
}

export function sortByEarliestFutureDateRange<T extends HasTimes>(
  events: T[]
): T[] {
  return sortBy(events, [
    m => {
      const times = m.times.map(time => ({
        start: time.range.startDateTime,
        end: time.range.endDateTime,
      }));

      const earliestRange = getEarliestFutureDateRange(times);
      return earliestRange && earliestRange.start;
    },
  ]);
}
