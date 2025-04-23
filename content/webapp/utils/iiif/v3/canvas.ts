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

// Items considered born digital, i.e. those without width, height or duration properties
// have a rendering with a behavior of 'original'.
// This is used to display a link to the original file.
// See: https://github.com/wellcomecollection/docs/blob/main/rfcs/046-born-digital-iiif/README.md
export function getOriginal(
  rendering: Canvas['rendering']
): CustomContentResource[] {
  const customRendering = rendering as CustomContentResource[];
  const original = customRendering?.filter(item => {
    return item?.behavior?.includes('original');
  });
  return original || [];
}

// Ordinarly we would use the painting array to display an item to the user, see https://iiif.io/api/presentation/3.0/#values-for-motivation
// However, if there is a PDF in the 'original' array we want to display that.
// If neither of those things are available we fallback to the supplementing array.
// This is because pdfs that are ingested via Goobi will be in the supplementing array.
// (N.B. pdfs ingested via Archivematica follow the Born Digital pattern)
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
