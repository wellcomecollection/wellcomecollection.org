import { EventSeries, EventSeriesBasic } from '../../../types/event-series';
import { EventSeriesDocument } from '@weco/common/prismicio-types';
import { transformGenericFields /*, asText */ } from '.';
// import { BackgroundTexture } from '@weco/common/model/background-texture';
// import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
// import * as prismic from '@prismicio/client';
// import { isNotUndefined } from '@weco/common/utils/type-guards';
import { transformContributors } from './contributors';

// function transformBackgroundTexture({
//   image,
//   name,
// }: {
//   image: prismic.ImageField;
//   name: prismic.KeyTextField;
// }): BackgroundTexture | undefined {
//   const backgroundName = asText(name);

//   return image.url && isNotUndefined(backgroundName)
//     ? { image: image.url, name: backgroundName }
//     : undefined;
// }

export function transformEventSeries(
  document: EventSeriesDocument
): EventSeries {
  const genericFields = transformGenericFields(document);

  // The backgroundTexture will always be set to undefined, as we don't use the
  // backgroundTexturesFetchLinks when we fetch the event-series.
  // I'm commenting this out for now as it is causing typing errors,
  // which we may or may not need to address, as part of
  // https://github.com/wellcomecollection/wellcomecollection.org/issues/10919
  // const backgroundTexture = isFilledLinkToDocumentWithData(
  //   document.data.backgroundTexture
  // )
  //   ? transformBackgroundTexture(document.data.backgroundTexture.data)
  //   : undefined;
  const backgroundTexture = undefined;

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
  };
}

export function transformEventSeriesToEventSeriesBasic(
  eventSeries: EventSeries
): EventSeriesBasic {
  return (({ id, title }) => ({
    id,
    title,
  }))(eventSeries);
}
