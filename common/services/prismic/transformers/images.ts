import * as prismic from '@prismicio/client';
import { ImageType } from '@weco/common/model/image';
import { isUndefined } from '@weco/common/utils/type-guards';
import { transformTaslFromString } from '.';
import { CustomPrismicFilledImage } from '../types';

// when images have crops, event if the image isn't attached, we get e.g.
// { '32:15': {}, '16:9': {}, square: {} }
function isImageLink(
  maybeImage: prismic.EmptyImageFieldImage | CustomPrismicFilledImage
): maybeImage is CustomPrismicFilledImage {
  return Boolean(maybeImage && maybeImage.dimensions);
}

export function transformImage(
  maybeImage:
    | prismic.EmptyImageFieldImage
    | CustomPrismicFilledImage
    | undefined
): ImageType | undefined {
  return maybeImage && isImageLink(maybeImage)
    ? transformFilledImage(maybeImage)
    : undefined;
}

// These are the props returned on a prismic image object
const prismicImageProps = ['dimensions', 'alt', 'copyright', 'url'];

function startsWith(s: string, prefix: string): boolean {
  return s.indexOf(prefix) === 0;
}

// We don't export this, as we probably always want to check ^ first
function transformFilledImage(image: CustomPrismicFilledImage): ImageType {
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
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const alt = image.alt!;
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  const simpleCrops = Object.keys(crops)
    .filter(key => {
      return (
        crops[key].alt === alt &&
        JSON.stringify(crops[key].tasl) === JSON.stringify(tasl)
      );
    })
    .reduce((acc, key) => {
      // Look to see if the simple crop is just the original crop with some
      // extra query parameters, e.g.
      //
      //      contentUrl = "https://example.org/cat.jpg"
      //      croppedUrl = "https://example.org/cat.jpg&rect=0,361,2566,1203"
      //
      // If so, we just include the suffix -- the full URL will be reconstructed
      // by the getCrop() method later.
      if (startsWith(crops[key].contentUrl, image.url)) {
        acc[key] = {
          contentUrlSuffix: crops[key].contentUrl.slice(image.url.length),
          width: crops[key].width,
          height: crops[key].height,
        };
      } else {
        acc[key] = {
          contentUrl: crops[key].contentUrl,
          width: crops[key].width,
          height: crops[key].height,
        };
      }
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
