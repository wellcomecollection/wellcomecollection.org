import { Tasl } from './tasl';

export type Crop = '32:15' | '16:9' | 'square';

type ImageBase = {
  contentUrl: string;
  width: number;
  height: number;
};

export type ImageType = ImageBase & {
  alt: string | null;
  tasl?: Tasl;

  // We distinguish between two types of crop:
  //
  //  - A "simple" crop is one where we've just adjusted the boundary, but
  //    the alt text and tasl are the same.  In this case, we can skip copying
  //    identical data onto all the different crops.  This has a non-trivial benefit
  //    for page weight.
  //  - A "rich" crop is where the image has new alt text or tasl, e.g. because
  //    the crop focuses on something distinct.  In this case, we need to include
  //    the new alt/tasl data.
  //
  // Downstream callers should never access these fields directly -- instead, they
  // should use getCrop(), which ensures they get the correct alt/tasl data.
  simpleCrops?: {
    [key in Crop]?: ImageBase;
  };
  richCrops?: {
    [key in Crop]?: ImageType;
  };
};

export function getCrop(
  image: ImageType | undefined,
  crop: Crop
): ImageType | undefined {
  const richImage = image?.richCrops && image?.richCrops[crop];
  const simpleImage = image?.simpleCrops && image?.simpleCrops[crop];

  return (
    richImage ||
    (simpleImage
      ? {
          ...simpleImage,
          alt: image.alt,
          tasl: image.tasl,
        }
      : undefined)
  );
}
