import {
  toCommonParts,
  fromCommonParts,
  CommonParts,
} from '@weco/content/utils/compressed-array';
import {
  TransformedCanvas,
  TransformedManifest,
  Original,
  Display,
} from './manifest';
import { ResourceType } from '@iiif/presentation-3';

type CompressedTransformedCanvases = {
  id: CommonParts;
  type: NonNullable<ResourceType>[];
  width: (number | undefined)[];
  height: (number | undefined)[];
  imageServiceId: CommonParts;
  restrictedImageIds: string[];
  label: CommonParts;
  textServiceId: CommonParts;
  thumbnailImageUrl: CommonParts;
  thumbnailImageWidth: (number | undefined)[];
  original: (Original | undefined)[];
  display: (Display | undefined)[];
};

export type CompressedTransformedManifest = Omit<
  TransformedManifest,
  'canvases'
> & {
  compressedCanvases: CompressedTransformedCanvases;
};

export function toCompressedTransformedManifest(
  manifest: TransformedManifest
): CompressedTransformedManifest {
  const { canvases, ...otherFields } = manifest;

  return {
    compressedCanvases: {
      id: toCommonParts(canvases.map(c => c.id)),
      type: canvases.map(c => c.type),
      width: canvases.map(c => c.width),
      height: canvases.map(c => c.height),
      imageServiceId: toCommonParts(canvases.map(c => c.imageServiceId)),
      restrictedImageIds: canvases
        .filter(c => c.hasRestrictedImage)
        .map(c => c.id),
      label: toCommonParts(canvases.map(c => c.label)),
      textServiceId: toCommonParts(canvases.map(c => c.textServiceId)),
      thumbnailImageUrl: toCommonParts(
        canvases.map(c => c.thumbnailImage?.url)
      ),
      thumbnailImageWidth: canvases.map(c => c.thumbnailImage?.width),
      original: canvases.map(c => c.original),
      display: canvases.map(c => c.display),
    },
    ...otherFields,
  };
}

export function fromCompressedManifest(
  manifest: CompressedTransformedManifest
): TransformedManifest {
  const { compressedCanvases, ...otherFields } = manifest;

  const id = fromCommonParts(compressedCanvases.id) as string[];
  const imageServiceId = fromCommonParts(compressedCanvases.imageServiceId);
  const label = fromCommonParts(compressedCanvases.label);
  const textServiceId = fromCommonParts(compressedCanvases.textServiceId);
  const thumbnailImageUrl = fromCommonParts(
    compressedCanvases.thumbnailImageUrl
  );

  const {
    type,
    width,
    height,
    restrictedImageIds,
    thumbnailImageWidth,
    original,
    display,
  } = compressedCanvases;

  const uncompressedCanvases: TransformedCanvas[] = [];

  for (let index = 0; index < id.length; index++) {
    const canvas: TransformedCanvas = {
      id: id[index],
      type: type[index],
      width: width[index],
      height: height[index],
      imageServiceId: imageServiceId[index],
      hasRestrictedImage: restrictedImageIds.includes(id[index]),
      label: label[index],
      textServiceId: textServiceId[index],
      thumbnailImage:
        thumbnailImageUrl[index] && thumbnailImageWidth[index]
          ? {
              /* eslint-disable @typescript-eslint/no-non-null-assertion */
              url: thumbnailImageUrl[index]!,
              width: thumbnailImageWidth[index]!,
              /* eslint-enable @typescript-eslint/no-non-null-assertion */
            }
          : undefined,
      original: original[index],
      display: display[index],
    };

    uncompressedCanvases.push(canvas);
  }

  return { ...otherFields, canvases: uncompressedCanvases };
}
