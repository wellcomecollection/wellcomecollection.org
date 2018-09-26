// @flow
import Prismic from 'prismic-javascript';
import {getEvents} from './events';
import type {EventSeries} from '../../model/event-series';
import type {PrismicDocument, PrismicQueryOpts} from './types';
import {
  parseGenericFields,
  parseBackgroundTexture,
  parseBody
} from './parsers';
import {getDocument} from './api';

export function parseEventSeries(document: PrismicDocument): EventSeries {
  const genericFields = parseGenericFields(document);
  const backgroundTexture = document.data.backgroundTexture && document.data.backgroundTexture.data;
  const body = document.data.body ? parseBody(document.data.body) : [];

  return {
    ...genericFields,
    type: 'event-series',
    backgroundTexture: backgroundTexture ? parseBackgroundTexture(backgroundTexture) : null,
    body: body
  };
}

type EventSeriesProps = {|
  id: string,
  ...PrismicQueryOpts
|}

export async function getEventSeries(req: ?Request, {
  id,
  ...opts
}: EventSeriesProps) {
  const events = await getEvents(req, {
    page: 1,
    predicates: [Prismic.Predicates.at('my.events.series.series', id)],
    order: 'desc',
    ...opts
  });

  if (events && events.results.length > 0) {
    const series = events.results[0].series.find(series => series.id === id);

    return series && {
      series,
      events: events.results
    };
  } else {
    // TODO: (perf) we shoulnd't really be doing two calls here, but it's for
    // when a series has no events attached.
    const document = await getDocument(req, id, {});
    return document && { series: parseEventSeries(document), events: [] };
  }
}
