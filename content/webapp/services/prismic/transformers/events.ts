import { parseEvents } from '@weco/common/services/prismic/events';
import { Event as DeprecatedEvent } from '@weco/common/model/events';
import { Event } from '../../../model/events';
import { EventPrismicDocument } from '../events';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transformEvent(document: EventPrismicDocument): Event {
  const event: DeprecatedEvent = parseEvents(document);

  return {
    ...event,
    prismicDocument: document,
  };
}
