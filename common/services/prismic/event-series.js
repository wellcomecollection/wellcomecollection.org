// @flow
import {getDocument} from './api';
import type {EventSeries} from '../../model/event-series';
import type {PrismicDocument} from './types';
import {eventSeriesFields}  from './fetch-links';
import {
  parseTitle,
  parseDescription,
  parseImagePromo,
  parseBackgroundTexture
} from './parsers';

export function parseEventSeries(document: PrismicDocument): EventSeries {
  const {data} = document;
  const prismicBackgroundTexture = data.backgroundTexture && data.backgroundTexture.data;
  const promo = data.promo && parseImagePromo(data.promo);

  return {
    type: 'event-series',
    id: document.id,
    title: data.title ? parseTitle(data.title) : '',
    description: data.description && parseDescription(data.description),
    backgroundTexture: prismicBackgroundTexture ? parseBackgroundTexture(prismicBackgroundTexture) : null,
    promo
  };
}

export async function getUiEventSeries(req: Request, id: string): Promise<?EventSeries> {
  const document = await getDocument(req, id, {
    fetchLinks: eventSeriesFields
  });

  if (document) {
    return parseEventSeries(document);
  }
}
