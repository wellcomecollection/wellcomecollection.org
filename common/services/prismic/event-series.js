// @flow
import {getDocument} from './api';
import type {EventSeries} from '../../model/event-series';
import type {PrismicDocument} from './types';
import {eventSeriesFields}  from './fetch-links';
import {
  parseGenericFields,
  parseBackgroundTexture
} from './parsers';

export function parseEventSeries(document: PrismicDocument): EventSeries {
  const genericFields = parseGenericFields(document);
  const backgroundTexture = document.data.backgroundTexture && document.data.backgroundTexture.data;

  return {
    ...genericFields,
    type: 'event-series',
    description: document.data.description,
    backgroundTexture: backgroundTexture ? parseBackgroundTexture(backgroundTexture) : null
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
