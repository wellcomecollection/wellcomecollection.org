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
const useIIIFManifestData = (work: Work): ManifestData => {
  const [manifestData, setManifestData] = useState<ManifestData>({
    // TODO redo values once ManifestData type is settled
    // function to use here and in transformer to return Object
    v2: {
      title: '',
      imageCount: 0,
      childManifestsCount: 0,
      showDownloadOptions: false,
      downloadOptions: [],
      pdfRendering: undefined,
      authService: undefined,
      tokenService: undefined,
      isAnyImageOpen: true,
      isTotallyRestricted: false,
      isCollectionManifest: false,
      manifests: [],
      canvases: [],
      parentManifestUrl: undefined,
      needsModal: false,
      searchService: undefined,
      structures: [],
    },
    v3: {
      audio: {
        sounds: [],
      },
      services: [],
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
