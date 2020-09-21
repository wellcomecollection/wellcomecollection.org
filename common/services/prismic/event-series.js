// @flow
import type { EventSeries } from '../../model/event-series';
import type { PrismicDocument, PrismicQueryOpts } from './types';
import Prismic from 'prismic-javascript';
import { getEvents } from './events';
import { parseGenericFields, parseBackgroundTexture } from './parsers';
import { getDocument } from './api';

export function parseEventSeries(document: PrismicDocument): EventSeries {
  const genericFields = parseGenericFields(document);
  const backgroundTexture =
    document.data.backgroundTexture && document.data.backgroundTexture.data;
  const labels = [
    {
      url: null,
      text: 'Event series',
    },
  ];

  return {
    ...genericFields,
    type: 'event-series',
    backgroundTexture: backgroundTexture
      ? parseBackgroundTexture(backgroundTexture)
      : null,
    labels: labels,
  };
}

type EventSeriesProps = {|
  id: string,
  ...PrismicQueryOpts,
|};

export async function getEventSeries(
  req: ?Request,
  { id, ...opts }: EventSeriesProps,
  memoizedPrismic: ?Object
) {
  const events = await getEvents(
    req,
    {
      page: 1,
      predicates: [Prismic.Predicates.at('my.events.series.series', id)],
      ...opts,
    },
    memoizedPrismic
  );

  if (events && events.results && events.results.length > 0) {
    const series = events.results[0].series.find(series => series.id === id);

    return (
      series && {
        series,
        events: events.results,
      }
    );
  } else {
    // TODO: (perf) we shouldn't really be doing two calls here, but it's for
    // when a series has no events attached.
    const document = await getDocument(req, id, {});
    return document && { series: parseEventSeries(document), events: [] };
  }
}
