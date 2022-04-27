import sortBy from 'lodash.sortby';
import { Moment } from 'moment';
import { london, formatDayDate } from '@weco/common/utils/format-date';
import {
  getNextWeekendDateRange,
  isDayPast,
  isFuture,
  isPast,
} from '@weco/common/utils/dates';
import { Event, EventBasic } from '../../types/events';

function getNextDateInFuture(event: EventBasic): Date | undefined {
  const futureTimes = event.times.filter(time =>
    isFuture(time.range.startDateTime)
  );

  if (futureTimes.length === 0) {
    return undefined;
  } else {
    return futureTimes.reduce((closestStartingDate, time) =>
      time.range.startDateTime <= closestStartingDate.range.startDateTime
        ? time
        : closestStartingDate
    ).range.startDateTime;
  }
}

function filterEventsByTimeRange(
  events: EventBasic[],
  start: Date,
  end: Date
): EventBasic[] {
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

function startOfDay(d: Date): Date {
  const res = new Date(d);
  res.setUTCHours(0, 0, 0, 0);
  return res;
}

function endOfDay(d: Date): Date {
  const res = new Date(d);
  res.setUTCHours(23, 59, 59, 999);
  return res;
}

function addDays(d: Date, days: number): Date {
  const res = new Date(d);
  res.setDate(res.getDate() + days);
  return res;
}

export function filterEventsForNext7Days(events: EventBasic[]): EventBasic[] {
  const startOfToday = startOfDay(new Date());
  const endOfNext7Days = endOfDay(addDays(new Date(), 7));

  return filterEventsByTimeRange(events, startOfToday, endOfNext7Days);
}

export function filterEventsForToday(events: EventBasic[]): EventBasic[] {
  const startOfToday = startOfDay(new Date());
  const endOfToday = endOfDay(new Date());

  return filterEventsByTimeRange(events, startOfToday, endOfToday);
}

export function filterEventsForWeekend(events: EventBasic[]): EventBasic[] {
  const { start, end } = getNextWeekendDateRange(new Date());
  return filterEventsByTimeRange(events, start, end);
}

export function orderEventsByNextAvailableDate(
  events: EventBasic[]
): EventBasic[] {
  const reorderedEvents = sortBy(
    [...events].filter(getNextDateInFuture),
    getNextDateInFuture
  );

  return reorderedEvents;
}

const GroupByFormat = {
  day: 'dddd',
  month: 'MMMM',
};
type GroupDatesBy = keyof typeof GroupByFormat;
type EventsGroup = {
  label: string;
  start: Date;
  end: Date;
  events: Event[];
};

export function groupEventsBy(
  events: Event[],
  groupBy: GroupDatesBy
): EventsGroup[] {
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
  const ranges: EventsGroup[] = getRanges(
    {
      start: london(range.start).startOf(groupBy),
      end: london(range.end).endOf(groupBy),
    },
    groupBy
  ).map(range => ({
    label: range.label,
    start: range.start.toDate(),
    end: range.end.toDate(),
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
      const isInRange = times.find(time => {
        if (
          (time.start >= range.start && time.start <= range.end) ||
          (time.end >= range.start && time.end <= range.end)
        ) {
          return true;
        }
      });
      const newEvents = isInRange ? range.events.concat([event]) : range.events;
      range.events = newEvents;
    });
  }, {});

  // Remove times from event that fall outside the range of the current event group it is in
  const rangesWithFilteredTimes = ranges.map(range => {
    const start = range.start;
    const end = range.end;
    const events = range.events.map(event => {
      const timesInRange = event.times.filter(time => {
        return (
          time.range.startDateTime >= start && time.range.endDateTime <= end
        );
      });

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
  start: Moment;
  end: Moment;
};

type Range = {
  label: string;
  start: Moment;
  end: Moment;
};

// TODO: maybe use a Map?
function getRanges(
  { start, end }: RangeProps,
  groupBy: GroupDatesBy,
  acc: Range[] = []
): Range[] {
  if (start.isBefore(end, groupBy) || start.isSame(end, groupBy)) {
    const newStart = start.clone().add(1, groupBy);
    const newAcc: Range[] = acc.concat([
      {
        label: formatDayDate(start),
        start: start.clone().startOf(groupBy),
        end: start.clone().endOf(groupBy),
      },
    ]);
    return getRanges({ start: newStart, end }, groupBy, newAcc);
  } else {
    return acc;
  }
}

export function isEventPast({ times }: Event): boolean {
  const hasFutureEvents = times.some(
    ({ range }) => !isDayPast(range.endDateTime)
  );
  return !hasFutureEvents;
}

export function upcomingDatesFullyBooked(event: Event | EventBasic): boolean {
  return (
    event.times.length > 0 &&
    event.times
      .filter(({ range }) => !isPast(range.endDateTime))
      .every(({ isFullyBooked }) => {
        return isFullyBooked;
      })
  );
}
