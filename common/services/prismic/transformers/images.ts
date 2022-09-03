import { EmptyImageFieldImage, FilledImageFieldImage } from '@prismicio/types';
import { ImageType } from '../../../model/image';
import { isUndefined } from '../../../utils/array';
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

  const alt = image.alt!;

  const simpleCrops = Object.keys(crops)
    .filter(key => {
      return (
        crops[key].alt === alt &&
        JSON.stringify(crops[key].tasl) === JSON.stringify(tasl)
      );
    })
    .reduce((acc, key) => {
      acc[key] = {
        contentUrl: crops[key].contentUrl,
        width: crops[key].width,
        height: crops[key].height,
      };
      return acc;
    }, {});

  const richCrops = Object.keys(crops)
    .filter(key => isUndefined(simpleCrops[key]))
    .reduce((acc, key) => {
      acc[key] = crops[key];
      return acc;
    }, {});

  return {
    contentUrl: image.url,
    width: image.dimensions.width,
    height: image.dimensions.height,
    alt,
    tasl,
    simpleCrops: Object.keys(simpleCrops).length > 0 ? simpleCrops : undefined,
    richCrops: Object.keys(richCrops).length > 0 ? richCrops : undefined,
  };
}
