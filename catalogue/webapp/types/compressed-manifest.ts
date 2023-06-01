import { isNotUndefined } from '@weco/common/utils/type-guards';
import { TransformedCanvas, TransformedManifest } from './manifest';

export function commonPrefix(s1: string, s2: string): string {
  // Find the position of the first character where the two strings
  // don't match, then take everything before that point.
  //
  // If there are no mismatches, then the strings are identical up
  // to the length of s1.
  const firstMismatch = [...Array(s1.length).keys()].find(i => s1[i] !== s2[i]);

  return firstMismatch === 0
    ? ''
    : firstMismatch
    ? s1.slice(0, firstMismatch)
    : s1;
}

export function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) {
    return '';
  }

  return strings.reduce(
    (longestPrefix, s) => commonPrefix(longestPrefix, s),
    strings[0]
  );
}

function reverse(s: string): string {
  return s.split('').reverse().join('');
}

export function longestCommonSuffix(strings: string[]): string {
  const reversedStrings = strings.map(reverse);

  return reverse(longestCommonPrefix(reversedStrings));
}

type CompressedTransformedCanvases = {
  idPrefix: string;
  imageServiceIdPrefix: string;
  labelPrefix: string;
  textServiceIdPrefix: string;
  thumbnailImageUrlPrefix: string;
  thumbnailImageUrlSuffix: string;
  canvases: TransformedCanvas[];
};

export type CompressedTransformedManifest = Omit<
  TransformedManifest,
  'canvases'
> & {
  canvases: CompressedTransformedCanvases;
};

export function toCompressedTransformedManifest(
  manifest: TransformedManifest
): CompressedTransformedManifest {
  const { canvases, ...otherFields } = manifest;

  const idPrefix = longestCommonPrefix(canvases.map(({ id }) => id));
  const imageServiceIdPrefix = longestCommonPrefix(
    canvases.map(({ imageServiceId }) => imageServiceId).filter(isNotUndefined)
  );
  const labelPrefix = longestCommonPrefix(
    canvases.map(({ label }) => label).filter(isNotUndefined)
  );
  const textServiceIdPrefix = longestCommonPrefix(
    canvases.map(({ textServiceId }) => textServiceId).filter(isNotUndefined)
  );
  const thumbnailImageUrlPrefix = longestCommonPrefix(
    canvases
      .map(({ thumbnailImage }) => thumbnailImage?.url)
      .filter(isNotUndefined)
  );
  const thumbnailImageUrlSuffix = longestCommonSuffix(
    canvases
      .map(({ thumbnailImage }) => thumbnailImage?.url)
      .filter(isNotUndefined)
  );

  const compressedCanvases = {
    idPrefix,
    imageServiceIdPrefix,
    labelPrefix,
    textServiceIdPrefix,
    thumbnailImageUrlPrefix,
    thumbnailImageUrlSuffix,
    canvases: canvases.map(canvas => ({
      ...canvas,
      id: canvas.id.slice(idPrefix.length),
      imageServiceId: canvas.imageServiceId?.slice(imageServiceIdPrefix.length),
      label: canvas.label?.slice(labelPrefix.length),
      textServiceId: canvas.textServiceId?.slice(textServiceIdPrefix.length),
      thumbnailImage: canvas.thumbnailImage
        ? {
            ...canvas.thumbnailImage,
            url: canvas.thumbnailImage.url.slice(
              thumbnailImageUrlPrefix.length,
              canvas.thumbnailImage.url.length - thumbnailImageUrlSuffix.length
            ),
          }
        : undefined,
    })),
  };

  return { ...otherFields, canvases: compressedCanvases };
}

export function fromCompressedManifest(
  manifest: CompressedTransformedManifest
): TransformedManifest {
  const { canvases, ...otherFields } = manifest;

  const {
    idPrefix,
    imageServiceIdPrefix,
    labelPrefix,
    textServiceIdPrefix,
    thumbnailImageUrlPrefix,
    thumbnailImageUrlSuffix,
  } = canvases;

  const uncompressedCanvases = canvases.canvases.map(canvas => ({
    ...canvas,
    id: idPrefix + canvas.id,
    imageServiceId:
      canvas.imageServiceId && imageServiceIdPrefix + canvas.imageServiceId,
    label: canvas.label && labelPrefix + canvas.label,
    textServiceId:
      canvas.textServiceId && textServiceIdPrefix + canvas.textServiceId,
    thumbnailImage: canvas.thumbnailImage && {
      ...canvas.thumbnailImage,
      url:
        thumbnailImageUrlPrefix +
        canvas.thumbnailImage.url +
        thumbnailImageUrlSuffix,
    },
  }));

  return { ...otherFields, canvases: uncompressedCanvases };
}
