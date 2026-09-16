import { Canvas } from '@iiif/presentation-3';

import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  CustomContentResource,
  ThumbnailImage,
  TransformedCanvas,
} from '@weco/content/types/manifest';

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

/**
 * The thumbnail to show for a canvas, at a usable size. Where the thumbnail
 * has an image service we request a size at least 400px tall from it;
 * otherwise we take the thumbnail as given.
 */
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

/**
 * The born-digital originals in a canvas's rendering, which we offer as a
 * download of the source file. Born-digital items are those without width,
 * height or duration, and they carry a rendering with an 'original' behaviour.
 * @see https://github.com/wellcomecollection/docs/blob/main/rfcs/046-born-digital-iiif/README.md
 */
export function getOriginal(
  rendering: Canvas['rendering']
): CustomContentResource[] {
  const customRendering = rendering as CustomContentResource[];
  const original = customRendering?.filter(item => {
    return item?.behavior?.includes('original');
  });
  return original || [];
}

/**
 * What to actually render for a canvas: an original PDF if there is one,
 * otherwise the painting content, otherwise supplementing - which is where
 * PDFs ingested via Goobi end up. PDFs ingested via Archivematica follow the
 * born-digital pattern instead, so they turn up in `original`.
 * @see https://iiif.io/api/presentation/3.0/#values-for-motivation
 */
export const getDisplayItems = (canvas: TransformedCanvas) => {
  const originalPdfs = canvas.original.filter(o => {
    if ('format' in o) {
      return o.format === 'application/pdf';
    } else {
      return false;
    }
  });

  return originalPdfs.length > 0
    ? originalPdfs
    : canvas.painting.length > 0
      ? canvas.painting
      : canvas.supplementing;
};
