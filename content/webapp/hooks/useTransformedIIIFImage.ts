import { useEffect, useState } from 'react';

import { DigitalLocation } from '@weco/common/model/catalogue';
import { fetchIIIFImageJson } from '@weco/content/services/iiif/fetch/image';
import { transformImageJSON } from '@weco/content/services/iiif/transformers/image';
import { IIIFImage } from '@weco/content/services/iiif/types/image/v2';
import { WorkBasic } from '@weco/content/services/wellcome/catalogue/types';
import { TransformedImageJSON } from '@weco/content/types/image';

const imagePromises: Map<string, Promise<IIIFImage | undefined>> = new Map();
const cachedTransformedImage: Map<string, TransformedImageJSON> = new Map();
const useTransformedIIIFImage = (
  work: WorkBasic,
  iiifImageLocation?: DigitalLocation
): TransformedImageJSON => {
  const [transformedIIIFImage, setTransformedIIIFImage] =
    useState<TransformedImageJSON>({ width: undefined, height: undefined });

  function transformAndUpdate(image: IIIFImage, id: string) {
    const transformedIIIFImage = transformImageJSON(image);
    cachedTransformedImage.set(id, transformedIIIFImage);
    setTransformedIIIFImage(transformedIIIFImage);
  }

  async function updateImage(
    work: WorkBasic,
    iiifImageLocation?: DigitalLocation
  ) {
    const cachedManifest = cachedTransformedImage.get(work.id);
    if (cachedManifest) {
      setTransformedIIIFImage(cachedManifest);
    } else {
      // If we've started fetching an image, we can just wait for that to resolve
      const existingPromise = imagePromises.get(work.id);
      if (existingPromise) {
        const iiifImage = await existingPromise;
        iiifImage && transformAndUpdate(iiifImage, work.id);
      } else {
        if (!iiifImageLocation) return;
        imagePromises.set(work.id, fetchIIIFImageJson(iiifImageLocation.url));
        const iiifImage = await imagePromises.get(work.id);
        iiifImage && transformAndUpdate(iiifImage, work.id);
      }
    }
  }

  useEffect(() => {
    updateImage(work, iiifImageLocation);
  }, [work.id]);

  return transformedIIIFImage;
};

export default useTransformedIIIFImage;
