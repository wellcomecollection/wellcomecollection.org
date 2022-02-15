import { EventSeries } from '../../../types/event-series';
import { EventSeriesPrismicDocument } from '../types/event-series';
import {
  parseGenericFields,
  parseBackgroundTexture,
} from '@weco/common/services/prismic/parsers';
import { link } from './vendored-helpers';

export function transformEventSeries(
  document: EventSeriesPrismicDocument
): EventSeries {
  const genericFields = parseGenericFields(document);
  const backgroundTexture =
    document.data.backgroundTexture &&
    link(document.data.backgroundTexture) &&
    document.data.backgroundTexture.data;
  const labels = [
    {
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
    prismicDocument: document,
  };
}
