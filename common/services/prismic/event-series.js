// @flow
import type {EventSeries} from '../../model/event-series';
import type {PrismicDocument} from './types';

import {
  parseGenericFields,
  parseBackgroundTexture,
  parseDescription,
  parseBody
} from './parsers';

export function parseEventSeries(document: PrismicDocument): EventSeries {
  const genericFields = parseGenericFields(document);
  const backgroundTexture = document.data.backgroundTexture && document.data.backgroundTexture.data;
  const body = document.data.body ? parseBody(document.data.body) : [];

  return {
    ...genericFields,
    type: 'event-series',
    description: parseDescription(document.data.description),
    backgroundTexture: backgroundTexture ? parseBackgroundTexture(backgroundTexture) : null,
    body: body.length > 0 ? body : document.data.description ? [{
      type: 'text',
      weight: 'default',
      value: parseDescription(document.data.description)
    }] : []
  };
}
