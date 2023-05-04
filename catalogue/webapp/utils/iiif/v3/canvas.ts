import { Canvas } from '@iiif/presentation-3';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import { ThumbnailImage } from '@weco/catalogue/types/manifest';

// Temporary type until iiif3 types are correct
type Thumbnail = {
  service: {
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
  const thumbnail = canvas.thumbnail[0] as Thumbnail; // ContentResource which this should be, doesn't have a service property
  const thumbnailService = Array.isArray(thumbnail.service)
    ? thumbnail.service[0]
    : thumbnail.service;
  const urlTemplate = iiifImageTemplate(thumbnailService['@id']);
  const preferredMinThumbnailHeight = 400;
  const preferredThumbnail = thumbnailService?.sizes
    ?.sort((a, b) => a.height - b.height)
    .find(dimensions => dimensions.height >= preferredMinThumbnailHeight);
  return (
    urlTemplate && {
      width: preferredThumbnail?.width || 30,
      url: urlTemplate({
        size: `${preferredThumbnail ? `${preferredThumbnail.width},` : 'max'}`,
      }),
    }
  );
}
