import { useEffect, useState } from 'react';
import { Work } from '@weco/common/model/catalogue';
import { transformManifest } from '../services/iiif/transformers/manifest';
import {
  fetchIIIFPresentationManifest,
  IIIFManifests,
} from '../services/iiif/fetch/manifest';
import {
  TransformedManifest,
  createDefaultTransformedManifest,
} from '../types/manifest';
import { getDigitalLocationOfType } from '../utils/works';

const manifestPromises: Map<
  string,
  Promise<IIIFManifests | undefined>
> = new Map();
const cachedTransformedManifest: Map<string, TransformedManifest> = new Map();
const useTransformedManifest = (work: Work): TransformedManifest => {
  const [transformedManifest, setTransformedManifest] =
    useState<TransformedManifest>(createDefaultTransformedManifest());

  function transformAndUpdate(manifest: IIIFManifests, id: string) {
    const transformedManifest = transformManifest(manifest);
    cachedTransformedManifest.set(id, transformedManifest);
    setTransformedManifest(transformedManifest);
  }

  async function updateManifest(work: Work) {
    const cachedManifest = cachedTransformedManifest.get(work.id);
    if (cachedManifest) {
      setTransformedManifest(cachedManifest);
    } else {
      // If we've started fetching a work, we can just wait for that to resolve
      const existingPromise = manifestPromises.get(work.id);
      if (existingPromise) {
        const iiifManifest = await existingPromise;
        iiifManifest && transformAndUpdate(iiifManifest, work.id);
      } else {
        const iiifPresentationLocation = getDigitalLocationOfType(
          work,
          'iiif-presentation'
        );
        if (!iiifPresentationLocation) return;
        manifestPromises.set(
          work.id,
          fetchIIIFPresentationManifest(iiifPresentationLocation.url)
        );
        const iiifManifest = await manifestPromises.get(work.id);
        iiifManifest && transformAndUpdate(iiifManifest, work.id);
      }
    }
  }

  useEffect(() => {
    updateManifest(work);
  }, [work.id]);

  return transformedManifest;
};

export default useTransformedManifest;
