import { useEffect, useState } from 'react';
import { Work } from '@weco/common/model/catalogue';
import { TransformedImageJSON } from '../types/image';
import { getDigitalLocationOfType } from '../utils/works';
import { IIIFImage } from '../services/iiif/types/image/v2';
import { fetchIIIFImageJson } from '../services/iiif/fetch/image';
import { transformImageJSON } from '../services/iiif/transformers/image';

const imagePromises: Map<string, Promise<IIIFImage | undefined>> = new Map();
const cachedTransformedImage: Map<string, TransformedImageJSON> = new Map();
const useTransformedIIIFImage = (work: Work): TransformedImageJSON => {
  const [transformedIIIFImage, setTransformedIIIFImage] =
    useState<TransformedImageJSON>({ width: undefined, height: undefined });

  function transformAndUpdate(image: IIIFImage, id: string) {
    const transformedIIIFImage = transformImageJSON(image);
    cachedTransformedImage.set(id, transformedIIIFImage);
    setTransformedIIIFImage(transformedIIIFImage);
  }

  async function updateImage(work: Work) {
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
        const iiifImageLocation = getDigitalLocationOfType(work, 'iiif-image');
        if (!iiifImageLocation) return;
        imagePromises.set(work.id, fetchIIIFImageJson(iiifImageLocation.url));
        const iiifImage = await imagePromises.get(work.id);
        iiifImage && transformAndUpdate(iiifImage, work.id);
      }
    }
  }

  useEffect(() => {
    updateImage(work);
  }, [work.id]);

  return transformedIIIFImage;
};

export default useTransformedIIIFImage;
