import { Tasl } from './tasl';

type ImageBase = {
  contentUrl: string;
  width: number;
  height: number;
};

export type ImageType = ImageBase & {
  alt?: string;
  tasl?: Tasl;

  // We distinguish between "basic crops" and
  basicCrops: Record<string, ImageBase>;
  fullCrops: Record<string, ImageType>;
};

export function getCrop(
  image: ImageType,
  crop: '32:15' | '16:9' | 'square'
): ImageType | undefined {
  return image.fullCrops[crop]
    ? image.fullCrops[crop]
    : image.basicCrops[crop]
    ? {
        ...image.basicCrops[crop],
        alt: image.alt,
        tasl: image.tasl,
        basicCrops: {},
        fullCrops: {},
      }
    : undefined;
}

export type UiImageType = ImageType & {
  sizesQueries: string;
  extraClasses?: string;
  isFull?: boolean;
  showTasl?: boolean;
  isWidthAuto?: boolean;
  setComputedImageWidth?: (value: number) => void;
  setIsWidthAuto?: (value: boolean) => void;
};
