import { UiEvent as DeprecatedEvent } from '@weco/common/model/events';
import { Override } from '@weco/common/utils/utility-types';
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
  }
>;
