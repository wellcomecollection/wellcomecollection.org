import { UiEvent as DeprecatedEvent } from '@weco/common/model/events';
import { Override } from '@weco/common/utils/utility-types';
import { EventPrismicDocument } from '../services/prismic/events';

export type Event = Override<
  DeprecatedEvent,
  {
    prismicDocument: EventPrismicDocument;
  }
>;
