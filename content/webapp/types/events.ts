import { UiEvent as DeprecatedEvent } from '@weco/common/model/events';
import { Override } from '@weco/common/utils/utility-types';
import { EventPrismicDocument } from '../services/prismic/types/events';
import { Contributor } from './contributors';

type EventSchedule = {
  event: Event;
  isNotLinked: boolean;
}[];

export type Event = Override<
  DeprecatedEvent,
  {
    schedule?: EventSchedule;
    contributors: Contributor[];
    prismicDocument: EventPrismicDocument;
  }
>;
