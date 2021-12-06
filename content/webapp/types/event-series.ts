import { EventSeries as DeprecatedEventSeries } from '@weco/common/model/event-series';
import { Override } from '@weco/common/utils/utility-types';
import { EventSeriesPrismicDocument } from '../services/prismic/types/event-series';

export type EventSeries = Override<
  DeprecatedEventSeries,
  {
    prismicDocument: EventSeriesPrismicDocument;
  }
>;
