import { EventSeries } from '../../../types/event-series';
import { EventSeriesPrismicDocument } from '../types/event-series';
import { transformGenericFields, asText } from '.';
import { BackgroundTexture } from '@weco/common/model/background-texture';
import { isFilledLinkToDocumentWithData } from '../types';
import { ImageField, KeyTextField } from '@prismicio/types';
import { isNotUndefined } from '@weco/common/utils/array';
import { transformContributors } from './contributors';

function transformBackgroundTexture({ image, name }: {
  image: ImageField,
  name: KeyTextField
}): BackgroundTexture | undefined {
  const backgroundName = asText(name);

  return image.url && isNotUndefined(backgroundName)
    ? { image: image.url, name: backgroundName }
    : undefined;
}

export function transformEventSeries(
  document: EventSeriesPrismicDocument
): EventSeries {
  const genericFields = transformGenericFields(document);

  const backgroundTexture = isFilledLinkToDocumentWithData(document.data.backgroundTexture)
    ? transformBackgroundTexture(document.data.backgroundTexture.data)
    : undefined;

  const labels = [
    {
      text: 'Event series',
    },
  ];
  
  const contributors = transformContributors(document);

  return {
    ...genericFields,
    type: 'event-series',
    backgroundTexture,
    labels,
    contributors,
    prismicDocument: document,
  };
}
