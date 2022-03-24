// Utilities for grouping events

import { isSameMonth } from '@weco/common/utils/dates';
import { EventTime } from '../../types/events';

type HasTimes = {
  times: EventTime[];
};

export type YearMonth = {
  year: number;
  month: number;
};

// Creates a label in the form YYYY-MM, e.g. "2001-02"
export function createLabel(ym: YearMonth): string {
  return startOf(ym).toISOString().slice(0, 7);
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
