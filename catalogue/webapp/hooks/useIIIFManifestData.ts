import { useEffect, useState } from 'react';
import { Work } from '@weco/common/model/catalogue';
import { transformManifest } from '../services/iiif/transformers/manifest';
import { fetchIIIFPresentationManifest } from '../services/iiif/fetch/manifest';
import { IIIFManifest } from '../services/iiif/types/manifest/v2';
import { Manifest } from '@iiif/presentation-3';
import { ManifestData } from '../types/manifest';
import { getDigitalLocationOfType } from '../utils/works';

const manifestPromises: Map<
  string,
  Promise<
    | {
        v2: IIIFManifest;
        v3: Manifest;
      }
    | undefined
  >
> = new Map();
const cachedManifestData: Map<string, ManifestData> = new Map();
const blankLabel = { '': [] };
const blankManifestV3 = {
  '@context': '',
  id: '',
  type: 'Manifest' as const,
  label: blankLabel,
  summary: blankLabel,
  homepage: [],
  metadata: [],
  items: [],
  services: [],
  placeholderCanvas: {
    id: '',
    type: 'Canvas' as const,
    label: blankLabel,
    items: [],
  },
  rendering: [],
};

const useIIIFManifestData = (work: Work): ManifestData => {
  const [manifestData, setManifestData] = useState<ManifestData>({
    imageCount: 0,
    childManifestsCount: 0,
    audio: {
      sounds: [],
    },
    manifestV3: blankManifestV3,
    v2: {
      // TODO update with required props
      imageCount: 0,
      childManifestsCount: 0,
    },
    v3: {
      audio: {
        sounds: [],
      },
    },
  });

  function transformAndUpdate(manifest, id) {
    const manifestData =
      manifest?.v2 &&
      manifest?.v3 &&
      transformManifest(manifest.v2, manifest.v3);
    if (manifestData) {
      cachedManifestData.set(id, manifestData);
      setManifestData(manifestData);
    }
  }

  async function updateManifest(work: Work) {
    const cachedManifest = cachedManifestData.get(work.id);
    if (cachedManifest) {
      setManifestData(cachedManifest);
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
  useEffect(() => {
    updateManifest(work);
  }, [work.id]);

  return manifestData;
};

export default useIIIFManifestData;
