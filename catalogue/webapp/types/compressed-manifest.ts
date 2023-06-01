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
  restrictedImageIds: string[];
  canvases: Omit<TransformedCanvas, 'hasRestrictedImage'>[];
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

  const restrictedImageIds = canvases
    .filter(c => c.hasRestrictedImage)
    .map(c => c.id);

  const compressedCanvases = {
    idPrefix,
    imageServiceIdPrefix,
    labelPrefix,
    textServiceIdPrefix,
    thumbnailImageUrlPrefix,
    thumbnailImageUrlSuffix,
    restrictedImageIds,
    canvases: canvases.map(canvas => {
      const { hasRestrictedImage, label, ...canvasFields } = canvas;

      const compressedLabel =
        label?.length === labelPrefix.length
          ? undefined
          : label?.slice(labelPrefix.length);

      return {
        ...canvasFields,
        id: canvas.id.slice(idPrefix.length),
        imageServiceId: canvas.imageServiceId?.slice(
          imageServiceIdPrefix.length
        ),
        label: compressedLabel,
        textServiceId: canvas.textServiceId?.slice(textServiceIdPrefix.length),
        thumbnailImage: canvas.thumbnailImage
          ? {
              ...canvas.thumbnailImage,
              url: canvas.thumbnailImage.url.slice(
                thumbnailImageUrlPrefix.length,
                canvas.thumbnailImage.url.length -
                  thumbnailImageUrlSuffix.length
              ),
            }
          : undefined,
      };
    }),
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
    restrictedImageIds,
  } = canvases;

  const uncompressedCanvases = canvases.canvases.map(canvas => ({
    ...canvas,
    id: idPrefix + canvas.id,
    imageServiceId:
      canvas.imageServiceId && imageServiceIdPrefix + canvas.imageServiceId,
    label:
      canvas.label || labelPrefix.length > 0
        ? labelPrefix + (canvas.label || '')
        : undefined,
    textServiceId:
      canvas.textServiceId && textServiceIdPrefix + canvas.textServiceId,
    thumbnailImage: canvas.thumbnailImage && {
      ...canvas.thumbnailImage,
      url:
        thumbnailImageUrlPrefix +
        canvas.thumbnailImage.url +
        thumbnailImageUrlSuffix,
    },
    hasRestrictedImage: restrictedImageIds.includes(idPrefix + canvas.id),
  }));

  return { ...otherFields, canvases: uncompressedCanvases };
}
