// @flow
import {getEvents} from './events';
import type {EventSeries} from '../../model/event-series';
import type {PrismicDocument} from './types';
import {
  parseGenericFields,
  parseBackgroundTexture,
  parseBody
} from './parsers';
import { getDocument } from './api';

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

type EventSeriesProps = {| id: string |}
export async function getEventSeries(req: Request, {
  id
}: EventSeriesProps) {
  const events = await getEvents(req, {
    seriesId: id,
    page: 1
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
