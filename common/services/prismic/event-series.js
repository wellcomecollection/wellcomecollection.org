// @flow
import type {EventSeries} from '../../model/event-series';
import type {PrismicDocument} from './types';
import {
  parseGenericFields,
  parseBackgroundTexture,
  parseBody
} from './parsers';

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
