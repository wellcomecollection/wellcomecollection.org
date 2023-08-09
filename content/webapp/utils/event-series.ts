import { isFuture } from '@weco/common/utils/dates';
import { HasTimes } from '@weco/content/types/events';

export function isUpcoming<T extends HasTimes>(event: T): boolean {
  return event.times.some(t => isFuture(t.range.endDateTime));
}

// Returns all the upcoming events from a given list.
//
// This is used to populate the "Coming up" list on event series pages.
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
