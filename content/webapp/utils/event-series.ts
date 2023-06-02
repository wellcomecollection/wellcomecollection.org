import {
  isFuture,
  isSameDay,
  maxDate,
  minDate,
} from '@weco/common/utils/dates';
import { HasTimes } from 'types/events';

export function isUpcoming<T extends HasTimes>(event: T): boolean {
  const startsInFuture = event.times.some(t => isFuture(t.range.startDateTime));

  // This is to account for events that span multiple days.
  //
  // e.g. https://wellcomecollection.org/events/YjyVoREAACAAhUvk has two schedule items
  // on different days:
  //
  //    - 22 April @ 15:00
  //    - 28 April @ 15:00
  //
  // The "times" field in Prismic just says "22 Apr – 28 Apr", and only the schedule
  // field on the event breaks it down in more detail -- which we don't have access to
  // on the event series page.
  //
  // We only check the end date for multi-day events because we want to avoid listing
  // an event as "upcoming" when it's already in progress (start is past, end is not).
  // We may show an event as "upcoming" after the final event has finished on the final
  // day, but it's unavoidable.
  //
  // Ideally we'd either have access to the detailed schedule, or break down the times
  // field with more granularity.  Both of those are a non-trivial amount of work:
  //
  //    - The schedule isn't available on the event series page; it's fetched as
  //      an async request with *another* Prismic query on event pages.
  //    - The times are used for event cards and don't seem to support multiple entries
  //      properly.  We want this event to show as "event @ 22 Apr – 28 Apr", but if you put
  //      in multiple times the site shows "event @ 22 Apr 15:00" in certain places.
  //      We could make this work properly, but it's more work than I want to do right now.
  //
  const earliestStartTime = minDate(
    event.times.map(t => t.range.startDateTime)
  );
  const latestEndTime = maxDate(event.times.map(t => t.range.endDateTime));

  const isMultiDayEvent = !isSameDay(earliestStartTime, latestEndTime, 'UTC');
  const isUnfinished = isFuture(latestEndTime);
  const endsOnAFutureDay = isMultiDayEvent && isUnfinished;

  return startsInFuture || endsOnAFutureDay;
}

// Returns all the upcoming events from a given list.
//
// This is used to populate the "What's next" list on event series pages.
//
export function getUpcomingEvents<T extends HasTimes>(events: T[]): T[] {
  return events.filter(isUpcoming).sort((a, b) => {
    const aStartTime = Math.min(
      ...a.times.map(aTime => aTime.range.startDateTime.valueOf())
    );
    const bStartTime = Math.min(
      ...b.times.map(bTime => bTime.range.startDateTime.valueOf())
    );
    return aStartTime - bStartTime;
  });
}
