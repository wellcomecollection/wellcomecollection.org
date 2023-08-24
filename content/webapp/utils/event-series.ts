import { isFuture } from '@weco/common/utils/dates';
import { HasTimes } from '@weco/content/types/events';

export function isUpcoming<T extends HasTimes>(event: T): boolean {
  return event.times.some(t => isFuture(t.range.endDateTime));
}
