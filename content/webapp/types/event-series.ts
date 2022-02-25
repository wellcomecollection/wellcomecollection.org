import { EventSeries as DeprecatedEventSeries } from '@weco/common/model/event-series';
import { Override } from '@weco/common/utils/utility-types';
import { EventSeriesPrismicDocument } from '../services/prismic/types/event-series';
import { Contributor } from './contributors';

export type EventSeries = Override<
  DeprecatedEventSeries,
  {
    contributors: Contributor[];
    prismicDocument: EventSeriesPrismicDocument;
  }
>;
