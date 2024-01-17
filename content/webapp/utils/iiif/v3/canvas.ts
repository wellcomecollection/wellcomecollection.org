import { Canvas } from '@iiif/presentation-3';
import {
  CustomSpecificationBehaviors,
  CustomContentResource,
  ThumbnailImage,
  BornDigitalData,
} from '@weco/content/types/manifest';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { isNotUndefined } from '@weco/common/utils/type-guards';

// Temporary type until iiif3 types are correct
type Thumbnail = {
  id: string;
  width: number;
  service?: {
    '@id': string;
    '@type': string;
    profile: string;
    width: number;
    height: number;
    sizes: { width: number; height: number }[];
  }[];
};

export function getThumbnailImage(canvas: Canvas): ThumbnailImage | undefined {
  if (!canvas.thumbnail) return;

  // The potential type here is extremely wide, but in practice we only
  // see a couple of formats in our manifests:
  //
  //    - A thumbnail with an associated IIIF image service, which is used
  //      for digitised books
  //    - A thumbnail with type Image but no associated image service, which
  //      is used for e.g. digitised PDFs
  //
  // We use our own type rather than trying to shoehorn this into the ContentResource
  // type provided by the IIIF libraries.
  //
  // See the tests for examples of each of these.
  const thumbnail = canvas.thumbnail[0] as Thumbnail;

  if (isNotUndefined(thumbnail.service)) {
    const thumbnailService = Array.isArray(thumbnail.service)
      ? thumbnail.service[0]
      : thumbnail.service;

    const urlTemplate = iiifImageTemplate(thumbnailService['@id']);
    const preferredMinThumbnailHeight = 400;
    const preferredThumbnail = thumbnailService?.sizes
      ?.sort((a, b) => a.height - b.height)
      .find(dimensions => dimensions.height >= preferredMinThumbnailHeight);
    return {
      width: preferredThumbnail?.width || 30,
      url: urlTemplate({
        size: preferredThumbnail ? `${preferredThumbnail.width},` : 'max',
      }),
    };
  } else {
    return {
      width: thumbnail.width,
      url: thumbnail.id,
    };
  }
}

// If the canvas has a behavior which includes 'placeholder'
// we know it is Born digital: https://github.com/wellcomecollection/docs/blob/main/rfcs/046-born-digital-iiif/README.md
// The data we need to display a link to the file is found in the rendering property of the canvas.
export function getBornDigitalData(
  canvas: Canvas
): BornDigitalData | undefined {
  const behavior = canvas?.behavior as
    | CustomSpecificationBehaviors[]
    | undefined;
  const isBornDigital = behavior?.includes('placeholder') || false;
  const rendering = canvas.rendering as CustomContentResource[];
  const originalRendering = rendering?.find(item => {
    return item?.behavior?.includes('original');
  });
  if (isBornDigital && originalRendering) {
    return {
      originalFile: originalRendering.id,
      label: originalRendering.label,
      format: originalRendering.format,
    };
  }
}
