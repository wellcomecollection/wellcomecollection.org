import { HasTimes } from 'types/events';

// Returns all the upcoming events from a given list.
//
// This is used to populate the "What's next" list on event series pages.
//
export function getUpcomingEvents<T extends HasTimes>(events: T[]): T[] {
  return events
    .filter(event => {
      return event.times.some(t => t.range.startDateTime > new Date());
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
