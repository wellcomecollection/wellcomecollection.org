import {
  getDatesBetween,
  isFuture,
  maxDate,
  minDate,
} from '@weco/common/utils/dates';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { HasTimeRanges } from '@weco/content/types/events';

export type YearMonth = {
  year: number;
  month: string;
};

/** Returns the UTC start of a given month. */
export function startOf({ year, month }: YearMonth): Date {
  return new Date(`1 ${month} ${year}`);
}

// Note: UTC months are 0-indexed
const utcMonthNames = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
};

/** Returns a list of all the months that fall on or between two dates.
 *
 * e.g. getDatesBetween({ start: 2001-01-01, end: 2001-04-05 })
 *    => { January 2001, February 2001, March 2001, April 2001 }
 *
 */
export function getMonthsInDateRange({
  startDate,
  endDate,
}: {
  startDate: Date | undefined;
  endDate: Date | undefined;
}): YearMonth[] {
  if (!startDate || !endDate) {
    return [];
  }

  console.assert(
    startDate <= endDate,
    `Asked to find months in date range start=${startDate}, end=${endDate}`
  );

  const result: YearMonth[] = [];

  getDatesBetween({ startDate, endDate }).forEach(d => {
    const m = {
      year: d.getUTCFullYear(),
      month: utcMonthNames[d.getUTCMonth()],
    };

    if (!result.length) {
      result.push(m);
    } else {
      const latestResult = result[result.length - 1];

      if (latestResult.year !== m.year || latestResult.month !== m.month) {
        result.push(m);
      }
    }
  });

  return result;
}

function isInMonth(d: Date, yearMonth: YearMonth): boolean {
  return (
    d.getUTCFullYear() === yearMonth.year &&
    utcMonthNames[d.getUTCMonth()] === yearMonth.month
  );
}

function getEarliestFutureStartTime({
  times,
}: HasTimeRanges): Date | undefined {
  return minDate(
    times
      .filter(
        t => isFuture(t.range.startDateTime) || isFuture(t.range.endDateTime)
      )
      .map(t => t.range.startDateTime)
  );
}

function getLatestFutureStartTime({ times }: HasTimeRanges): Date | undefined {
  return maxDate(
    times
      .filter(
        t => isFuture(t.range.startDateTime) || isFuture(t.range.endDateTime)
      )
      .map(t => t.range.startDateTime)
  );
}

type GroupedEvent<T> = {
  month: YearMonth;
  events: T[];
};

export function groupEventsByMonth<T extends HasTimeRanges>(
  events: T[]
): GroupedEvent<T>[] {
  // Work out the min/max bounds for the list of events.
  const earliestStartTime = minDate(
    events.map(getEarliestFutureStartTime).filter(isNotUndefined)
  );
  const latestStartTime = maxDate(
    events.map(getLatestFutureStartTime).filter(isNotUndefined)
  );

  // Work out what months this should cover
  //
  // This gives us the list of months that will appear in the segmented control
  // on the "What's on" page
  const monthSpan = getMonthsInDateRange({
    startDate: earliestStartTime,
    endDate: latestStartTime,
  });

  // For each month, work out (a) what events should be included and
  // (b) what order those events should appear in.
  return monthSpan.map(month => {
    const eventsInMonth = events
      .map(ev => {
        // For each event, we ask:
        //
        //    - does it have any start/end times in this month?
        //        => should it appear in the list of events for this month?
        //
        //    - what's the earliest time it starts in this month?
        //        => where should it appear in the order of events for this month?
        //
        // Note that we may be partway through the month, so we need to sort based on
        // the next future date -- this is what will appear on the card.
        //
        const rangesInMonth = ev.times
          .map(t => t.range)
          .filter(
            t =>
              (isInMonth(t.startDateTime, month) &&
                isFuture(t.startDateTime)) ||
              (isInMonth(t.endDateTime, month) && isFuture(t.endDateTime))
          );

        return rangesInMonth.length > 0
          ? {
              event: ev,
              earliestRangeInMonth: rangesInMonth.reduce((a, b) =>
                a.startDateTime < b.startDateTime ? a : b
              ),
            }
          : undefined;
      })
      .filter(isNotUndefined)
      .sort((a, b) => {
        // We sort the events within each month by their earliest start date,
        // so events appear in the order they're going to occur.
        //
        // If there are two events that start at the same time, we sort them by
        // end time.  This is an arbitrary choice, and just for consistent behaviour.
        const rangeA = a.earliestRangeInMonth;
        const rangeB = b.earliestRangeInMonth;

        return rangeA.startDateTime > rangeB.startDateTime
          ? 1
          : rangeA.startDateTime < rangeB.startDateTime
            ? -1
            : rangeA.endDateTime > rangeB.endDateTime
              ? 1
              : -1;
      })
      .map(ev => ev.event);

    return { month, events: eventsInMonth };
  });
}
