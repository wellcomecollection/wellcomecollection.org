import { HasTimes } from 'types/events';

// Returns all the upcoming events from a given list.
//
// This is used to populate the "What's next" list on event series pages.
//
export function getUpcomingEvents<T extends HasTimes>(events: T[]): T[] {
  return events
    .filter(event => {
      const lastStartTime =
        event.times.length > 0
          ? event.times[event.times.length - 1].range.startDateTime
          : null;
      const inTheFuture = lastStartTime
        ? new Date(lastStartTime) > new Date()
        : false;
      return inTheFuture;
    })
    .sort((a, b) => {
      const aStartTime = Math.min(
        ...a.times.map(aTime => aTime.range.startDateTime.valueOf())
      );
      const bStartTime = Math.min(
        ...b.times.map(bTime => bTime.range.startDateTime.valueOf())
      );
      return aStartTime - bStartTime;
    });
}
