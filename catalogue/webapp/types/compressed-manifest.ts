import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  findLongestCommonParts,
  CommonParts,
  removeCommonParts,
  restoreCommonParts,
} from '@weco/common/utils/array';
import { TransformedCanvas, TransformedManifest } from './manifest';

type CompressedTransformedCanvases = {
  idCommonParts: CommonParts;
  imageServiceIdCommonParts: CommonParts;
  labelCommonParts: CommonParts;
  textServiceIdCommonParts: CommonParts;
  thumbnailImageUrlCommonParts: CommonParts;
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

  const idCommonParts = findLongestCommonParts(canvases.map(({ id }) => id));
  const imageServiceIdCommonParts = findLongestCommonParts(
    canvases.map(({ imageServiceId }) => imageServiceId).filter(isNotUndefined)
  );
  const labelCommonParts = findLongestCommonParts(
    canvases.map(({ label }) => label).filter(isNotUndefined)
  );
  const textServiceIdCommonParts = findLongestCommonParts(
    canvases.map(({ textServiceId }) => textServiceId).filter(isNotUndefined)
  );
  const thumbnailImageUrlCommonParts = findLongestCommonParts(
    canvases
      .map(({ thumbnailImage }) => thumbnailImage?.url)
      .filter(isNotUndefined)
  );

  const restrictedImageIds = canvases
    .filter(c => c.hasRestrictedImage)
    .map(c => c.id);

  const compressedCanvases = {
    idCommonParts,
    imageServiceIdCommonParts,
    labelCommonParts,
    textServiceIdCommonParts,
    thumbnailImageUrlCommonParts,
    restrictedImageIds,
    canvases: canvases.map(canvas => {
      const { hasRestrictedImage, label, ...canvasFields } = canvas;

      return {
        ...canvasFields,
        id: removeCommonParts(canvas.id, idCommonParts),
        imageServiceId:
          canvas.imageServiceId &&
          removeCommonParts(canvas.imageServiceId, imageServiceIdCommonParts),
        label:
          canvas.label && removeCommonParts(canvas.label, labelCommonParts),
        textServiceId:
          canvas.textServiceId &&
          removeCommonParts(canvas.textServiceId, textServiceIdCommonParts),
        thumbnailImage: canvas.thumbnailImage
          ? {
              ...canvas.thumbnailImage,
              url: removeCommonParts(
                canvas.thumbnailImage.url,
                thumbnailImageUrlCommonParts
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
    idCommonParts,
    imageServiceIdCommonParts,
    labelCommonParts,
    textServiceIdCommonParts,
    thumbnailImageUrlCommonParts,
    restrictedImageIds,
  } = canvases;

  const uncompressedCanvases = canvases.canvases.map(canvas => {
    const canvasId = restoreCommonParts(canvas.id, idCommonParts);

    return {
      ...canvas,
      id: canvasId,
      imageServiceId:
        canvas.imageServiceId &&
        restoreCommonParts(canvas.imageServiceId, imageServiceIdCommonParts),
      label: canvas.label && restoreCommonParts(canvas.label, labelCommonParts),
      textServiceId:
        canvas.textServiceId &&
        restoreCommonParts(canvas.textServiceId, textServiceIdCommonParts),
      thumbnailImage: canvas.thumbnailImage && {
        ...canvas.thumbnailImage,
        url: restoreCommonParts(
          canvas.thumbnailImage.url,
          thumbnailImageUrlCommonParts
        ),
      },
      hasRestrictedImage: restrictedImageIds.includes(canvasId),
    };
  });

  return { ...otherFields, canvases: uncompressedCanvases };
}
