import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  longestCommonPrefix,
  longestCommonSuffix,
} from '@weco/common/utils/array';
import { TransformedCanvas, TransformedManifest } from './manifest';

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
