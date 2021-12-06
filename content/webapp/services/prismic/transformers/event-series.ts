import { parseEventSeries } from '@weco/common/services/prismic/event-series';
import { EventSeries as DeprecatedEventSeries } from '@weco/common/model/event-series';
import { EventSeries } from '../../../types/event-series';
import { EventSeriesPrismicDocument } from '../types/event-series';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function transformEventSeries(
  document: EventSeriesPrismicDocument
): EventSeries {
  const eventSeries: DeprecatedEventSeries = parseEventSeries(document);

  return {
    ...eventSeries,
    prismicDocument: document,
  };
}
