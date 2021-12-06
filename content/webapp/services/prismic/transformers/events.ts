import { parseEventDoc } from '@weco/common/services/prismic/events';
import { UiEvent as DeprecatedEvent } from '@weco/common/model/events';
import { Event } from '../../../types/events';
import { EventPrismicDocument } from '../types/events';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transformEvent(document: EventPrismicDocument): Event {
  const event: DeprecatedEvent = parseEventDoc(document);

  return {
    ...event,
    prismicDocument: document,
  };
}
