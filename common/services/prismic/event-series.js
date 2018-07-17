// @flow
import type {EventSeries} from '../../model/event-series';
import type {PrismicDocument} from './types';

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
