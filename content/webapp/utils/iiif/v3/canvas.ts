import { Canvas, ImageService } from '@iiif/presentation-3';

import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  CustomContentResource,
  ThumbnailImage,
  TransformedCanvas,
} from '@weco/content/types/manifest';

/**
 * The thumbnail to show for a canvas, at a usable size. Where the thumbnail
 * has an image service we request a size at least 400px tall from it;
 * otherwise we take the thumbnail as given.
 *
 * The type IIIF allows here is very wide, but the only two shapes we've seen
 * in our manifests are a thumbnail with an image service, used for digitised
 * books, and one with type Image and no service, used for e.g. digitised
 * PDFs. The tests have an example of each.
 */
export function getThumbnailImage(canvas: Canvas): ThumbnailImage | undefined {
  const thumbnail = canvas.thumbnail?.[0];
  if (!thumbnail) return;

  const service =
    'service' in thumbnail
      ? thumbnail.service?.find(
          (s): s is ImageService & { '@id': string } =>
            '@id' in s && typeof s['@id'] === 'string'
        )
      : undefined;

  if (isNotUndefined(service)) {
    const urlTemplate = iiifImageTemplate(service['@id']);
    const preferredMinThumbnailHeight = 400;
    const preferredThumbnail = service.sizes
      ?.sort((a, b) => a.height - b.height)
      .find(dimensions => dimensions.height >= preferredMinThumbnailHeight);
    return {
      width: preferredThumbnail?.width || 30,
      url: urlTemplate({
        size: preferredThumbnail ? `${preferredThumbnail.width},` : 'max',
      }),
    };
  }

  // Some thumbnails carry no width at all, in which case there's no usable
  // size to report and we treat it as having no thumbnail.
  return 'width' in thumbnail &&
    typeof thumbnail.width === 'number' &&
    thumbnail.id
    ? { width: thumbnail.width, url: thumbnail.id }
    : undefined;
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
