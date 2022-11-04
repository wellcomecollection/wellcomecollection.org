import { isNotUndefined } from '@weco/common/utils/array';
import {
  getDatesBetween,
  isFuture,
  maxDate,
  minDate,
} from '@weco/common/utils/dates';
import { HasTimeRanges } from '../../types/events';

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
  start,
  end,
}: {
  start: Date;
  end: Date;
}): YearMonth[] {
  console.assert(
    start < end,
    `Asked to find months in date range start=${start}, end=${end}`
  );

  const result: YearMonth[] = [];

  getDatesBetween({ start, end }).forEach(d => {
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

function getEarliestStartTime({ times }: HasTimeRanges): Date {
  return minDate(
    times
      .filter(
        t => isFuture(t.range.startDateTime) || isFuture(t.range.endDateTime)
      )
      .map(t => t.range.startDateTime)
  );
}

function getLatestStartTime({ times }: HasTimeRanges): Date {
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
  const earliestStartTime = minDate(events.map(getEarliestStartTime));
  const latestStartTime = maxDate(events.map(getLatestStartTime));

  // Work out what months this should cover
  //
  // This gives us the list of months that will appear in the segmented control
  // on the "What's on" page
  const monthSpan = getMonthsInDateRange({
    start: earliestStartTime,
    end: latestStartTime,
  });

  // For each month, work out (a) what events should be included and
  // (b) what order those events should appear in.
  return monthSpan.map(month => {
    const eventsInMonth = events
      .map(ev => {
        // For each event, we ask:
        //
        //    - does it have any start times in this month?
        //        => should it appear in the list of events for this month?
        //
        //    - what's the earliest time it starts in this month?
        //        => where should it appear in the order of events for this month?
        //
        const rangesInMonth = ev.times
          .map(t => t.range)
          .filter(t => isInMonth(t.startDateTime, month));

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
