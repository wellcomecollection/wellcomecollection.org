import { Canvas, SpecificationBehaviors } from '@iiif/presentation-3';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { ThumbnailImage, BornDigitalData } from '@weco/content/types/manifest';
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

// TODO don't duplicate types with util/index;
type CustomSpecificationBehaviors = SpecificationBehaviors | 'placeholder';

// TODO comments explaining what is going on
export function getBornDigitalData(
  canvas: Canvas
): BornDigitalData | undefined {
  const behavior = canvas?.behavior as
    | CustomSpecificationBehaviors[]
    | undefined;
  const isBornDigital = behavior?.includes('placeholder') || false;
  const originalRendering = canvas.rendering?.find(item => {
    return item?.behavior?.includes('original'); // TODO fix type
  });
  if (isBornDigital && originalRendering) {
    return {
      originalFile: originalRendering?.id,
      label: originalRendering.label, // TODO fix type
      format: originalRendering.format, // TODO fix type
    };
  }
}
