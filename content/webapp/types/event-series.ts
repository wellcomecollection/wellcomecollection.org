import { EventSeries as DeprecatedEventSeries } from '@weco/common/model/event-series';
import { Override } from '@weco/common/utils/utility-types';
import { Contributor } from './contributors';

export type EventSeries = Override<
  DeprecatedEventSeries,
  {
    contributors: Contributor[];
  }
>;
