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
  const [manifestData, setTransformedManifest] = useState<TransformedManifest>(
    createDefaultTransformedManifest()
  );

  function transformAndUpdate(manifest, id) {
    // TODO types
    const manifestData = transformManifest(manifest);
    cachedTransformedManifest.set(id, manifestData);
    setTransformedManifest(manifestData);
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
        transformAndUpdate(iiifManifest, work.id);
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
        transformAndUpdate(iiifManifest, work.id);
      }
    }
  }

  // TODO when does this get run, i.e. when does the work.id change? and why do we need it - I'm not clear about this
  // presumably realted to archiveTree
  useEffect(() => {
    updateManifest(work);
  }, [work.id]);

  return manifestData;
};

export default useTransformedManifest;
