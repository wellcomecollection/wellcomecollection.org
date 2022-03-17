import { EmptyImageFieldImage, FilledImageFieldImage } from '@prismicio/types';
import { ImageType } from '@weco/common/model/image';
import { transformTaslFromString } from '.';

// when images have crops, event if the image isn't attached, we get e.g.
// { '32:15': {}, '16:9': {}, square: {} }
function isImageLink(
  maybeImage: EmptyImageFieldImage | FilledImageFieldImage
): maybeImage is FilledImageFieldImage {
  return Boolean(maybeImage && maybeImage.dimensions);
}

export function transformImage(
  maybeImage: EmptyImageFieldImage | FilledImageFieldImage | undefined
): ImageType | undefined {
  return maybeImage && isImageLink(maybeImage)
    ? transformFilledImage(maybeImage)
    : undefined;
}

// These are the props returned on a prismic image object
const prismicImageProps = ['dimensions', 'alt', 'copyright', 'url'];

// We don't export this, as we probably always want to check ^ first
function transformFilledImage(image: FilledImageFieldImage): ImageType {
  const tasl = transformTaslFromString(image.copyright);
  const crops = Object.keys(image)
    .filter(key => prismicImageProps.indexOf(key) === -1)
    .filter(key => isImageLink(image[key]))
    .map(key => ({
      key,
      image: transformFilledImage(image[key]),
    }))
    .reduce((acc, { key, image }) => {
      acc[key] = image;
      return acc;
    }, {});

  return {
    contentUrl: image.url,
    width: image.dimensions.width,
    height: image.dimensions.height,
    alt: image.alt!,
    tasl: tasl,
    crops: crops,
  };
}
