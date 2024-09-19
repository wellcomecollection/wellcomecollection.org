import { EventSeriesDocument as RawEventSeriesDocument } from '@weco/common/prismicio-types';
import {
  EventSeries,
  EventSeriesBasic,
} from '@weco/content/types/event-series';

import { transformGenericFields /*, asText */ } from '.';
import { transformContributors } from './contributors';

// import { BackgroundTexture } from '@weco/common/model/background-texture';
// import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
// import * as prismic from '@prismicio/client';
// import { isNotUndefined } from '@weco/common/utils/type-guards';

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
  document: RawEventSeriesDocument
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
    uid: document.uid,
    backgroundTexture,
    labels,
    contributors,
  };
}

export function transformEventSeriesToEventSeriesBasic(
  eventSeries: EventSeries
): EventSeriesBasic {
  return (({ id, uid, title }) => ({
    id,
    uid,
    title,
  }))(eventSeries);
}
