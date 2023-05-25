import { formatDayDate } from '@weco/common/utils/format-date';
import {
  addDays,
  endOfDay,
  getNextWeekendDateRange,
  isDayPast,
  isFuture,
  isPast,
  isSameDayOrBefore,
  minDate,
  startOfDay,
} from '@weco/common/utils/dates';
import { HasTimes } from '../../types/events';
import { isNotUndefined } from '@weco/common/utils/type-guards';

function getNextDateInFuture(event: HasTimes): Date | undefined {
  const futureTimes = event.times.filter(
    time =>
      isFuture(time.range.startDateTime) || isFuture(time.range.endDateTime)
  );

  if (futureTimes.length === 0) {
    // Events which don't have any future times should have been filtered
    // out by the time we call this function (e.g. the period filters
    // mean we shouldn't have fetched them from Prismic).
    //
    // If we do return an empty list here, it implies there's a mismatch
    // between what different functions think of as a "future" event, so
    // drop a warning so we know to investigate.
    const eventId = (event as any).id;
    console.warn(
      `No future times – why did we call getNextDateInFuture(${eventId})?`
    );

    return undefined;
  } else {
    return minDate(futureTimes.map(time => time.range.startDateTime));
  }
}

function filterEventsByTimeRange<T extends HasTimes>(
  events: T[],
  start: Date,
  end: Date
): T[] {
  return events.filter(event => {
    return event.times.find(time => {
      const eventStart = time.range.startDateTime;
      const eventEnd = time.range.endDateTime;

      return (
        (start <= eventStart && eventStart <= end) ||
        (start <= eventEnd && eventEnd <= end) ||
        (eventStart <= start && end <= eventEnd)
      );
    });
  });
}

export function filterEventsForNext7Days<T extends HasTimes>(events: T[]): T[] {
  const startOfToday = startOfDay(new Date());
  const endOfNext7Days = endOfDay(addDays(new Date(), 7));

  return filterEventsByTimeRange(events, startOfToday, endOfNext7Days);
}

export function filterEventsForToday<T extends HasTimes>(events: T[]): T[] {
  const startOfToday = startOfDay(new Date());
  const endOfToday = endOfDay(new Date());

  return filterEventsByTimeRange(events, startOfToday, endOfToday);
}

export function filterEventsForWeekend<T extends HasTimes>(events: T[]): T[] {
  const { start, end } = getNextWeekendDateRange(new Date());
  return filterEventsByTimeRange(events, start, end);
}

export function orderEventsByNextAvailableDate<T extends HasTimes>(
  events: T[]
): T[] {
  return events
    .map(event => {
      const nextFutureDate = getNextDateInFuture(event);
      return isNotUndefined(nextFutureDate)
        ? { event, nextFutureDate }
        : undefined;
    })
    .filter(isNotUndefined)
    .sort((a, b) => a.nextFutureDate.valueOf() - b.nextFutureDate.valueOf())
    .map(({ event }) => event);
}

type EventsGroup<T> = {
  label: string;
  start: Date;
  end: Date;
  events: T[];
};

export function groupEventsByDay<T extends HasTimes>(
  events: T[]
): EventsGroup<T>[] {
  // Get the full range of all the events
  const range = events
    .map(({ times }) =>
      times.map(time => ({
        start: time.range.startDateTime,
        end: time.range.endDateTime,
      }))
    )
    .reduce((acc, ranges) => acc.concat(ranges))
    .reduce((acc, range) => {
      return {
        start: range.start < acc.start ? range.start : acc.start,
        end: range.end > acc.end ? range.end : acc.end,
      };
    });

  // Convert the range into an array of labeled event groups
  const ranges: EventsGroup<T>[] = getRanges({
    start: startOfDay(range.start),
    end: endOfDay(range.end),
  }).map(range => ({
    ...range,
    events: [],
  }));

  // See which events should go into which event group
  events.forEach(event => {
    const times = event.times
      .filter(time => time.range && time.range.startDateTime)
      .map(time => ({
        start: time.range.startDateTime,
        end: time.range.endDateTime,
      }));

    ranges.forEach(range => {
      const isInRange = times.find(
        time =>
          (range.start <= time.start && time.start <= range.end) ||
          (range.start <= time.end && time.end <= range.end)
      );
      const newEvents = isInRange ? range.events.concat([event]) : range.events;
      range.events = newEvents;
    });
  }, {});

  // Remove times from event that fall outside the range of the current event group it is in
  const rangesWithFilteredTimes = ranges.map(range => {
    const { start, end } = range;
    const events = range.events.map(event => {
      const timesInRange = event.times.filter(
        time =>
          time.range.startDateTime >= start && time.range.endDateTime <= end
      );

      return {
        ...event,
        times: timesInRange,
      };
    });

    return {
      ...range,
      events,
    };
  });

  return rangesWithFilteredTimes;
}

type RangeProps = {
  start: Date;
  end: Date;
};

type Range = {
  label: string;
  start: Date;
  end: Date;
};

// TODO: maybe use a Map?
function getRanges({ start, end }: RangeProps, acc: Range[] = []): Range[] {
  if (isSameDayOrBefore(start, end)) {
    const newStart = addDays(start, 1);
    const newAcc: Range[] = acc.concat([
      {
        label: formatDayDate(start),
        start: startOfDay(start),
        end: endOfDay(start),
      },
    ]);
    return getRanges({ start: newStart, end }, newAcc);
  } else {
    return acc;
  }
}

export function isEventPast({ times }: HasTimes): boolean {
  const hasFutureEvents = times.some(
    ({ range }) => !isDayPast(range.endDateTime)
  );
  return !hasFutureEvents;
}

export function upcomingDatesFullyBooked(event: HasTimes): boolean {
  const upcoming =
    event.times.length > 0
      ? event.times.filter(({ range }) => !isPast(range.endDateTime))
      : [];
  if (upcoming.length > 0) {
    return upcoming.every(
      ({ isFullyBooked }) => isFullyBooked.inVenue && isFullyBooked.online
    );
  } else {
    return false;
  }
}
