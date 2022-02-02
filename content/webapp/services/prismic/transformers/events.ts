import { parseEventDoc } from '@weco/common/services/prismic/events';
import { UiEvent as DeprecatedEvent } from '@weco/common/model/events';
import { Event } from '../../../types/events';
import { EventPrismicDocument } from '../types/events';
import { link } from './vendored-helpers';
import { isNotUndefined } from '@weco/common/utils/array';
import { Query } from '@prismicio/types';

export function transformEvent(
  document: EventPrismicDocument,
  scheduleQuery?: Query<EventPrismicDocument>
): Event {
  const event: DeprecatedEvent = parseEventDoc(document, scheduleQuery);

  return {
    ...event,
    prismicDocument: document,
  };
}

export const getScheduleIds = (
  eventDocument: EventPrismicDocument
): string[] => {
  return eventDocument.data.schedule
    .map(linkField => (link(linkField.event) ? linkField.event.id : undefined))
    .filter(isNotUndefined);
};
