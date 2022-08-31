import { useEffect, useState } from 'react';
import {
  getCanvases,
  getDownloadOptionsFromManifest,
  getFirstChildManifestLocation,
  getIIIFPresentationCredit,
  getUiExtensions,
  getVideo,
  isUiEnabled,
  getIIIFManifest,
  getAudioV3,
} from '../utils/iiif';
import { Work } from '@weco/common/model/catalogue';
import {
  AudioV3,
  IIIFManifest,
  IIIFMediaElement,
  IIIFRendering,
} from '../model/iiif';
import { Manifest } from '@iiif/presentation-3';
import { getDigitalLocationOfType } from '../utils/works';

type IIIFManifestData = {
  imageCount: number;
  childManifestsCount: number;
  audio: AudioV3;
  video?: IIIFMediaElement;
  iiifCredit?: string;
  iiifPresentationDownloadOptions?: IIIFRendering[];
  iiifDownloadEnabled?: boolean;
  firstChildManifestLocation?: string;
  manifestV3: Manifest;
};

function parseManifest(
  manifest: IIIFManifest,
  manifestV3: Manifest
): IIIFManifestData {
  const imageCount = getCanvases(manifest).length;
  const childManifestsCount = manifest.manifests
    ? manifest.manifests.length
    : 0;
  const audio = getAudioV3(manifestV3);
  const video = getVideo(manifest);
  const iiifCredit = getIIIFPresentationCredit(manifest);
  const iiifPresentationDownloadOptions =
    getDownloadOptionsFromManifest(manifest);
  const iiifDownloadEnabled = isUiEnabled(
    getUiExtensions(manifest),
    'mediaDownload'
  );
  const firstChildManifestLocation = getFirstChildManifestLocation(manifest);

  return {
    imageCount,
    childManifestsCount,
    audio,
    video,
    iiifCredit,
    iiifPresentationDownloadOptions,
    iiifDownloadEnabled,
    firstChildManifestLocation,
    manifestV3,
  };
}

const startedFetchingIds = new Set();

export async function fetchIIIFPresentationManifest(
  work: Work
): Promise<IIIFManifestData | undefined> {
  startedFetchingIds.add(work.id);
  try {
    const iiifPresentationLocation = getDigitalLocationOfType(
      work,
      'iiif-presentation'
    );

    if (!iiifPresentationLocation) return;

    const iiifManifestV3Promise = getIIIFManifest(
      iiifPresentationLocation.url.replace('/v2/', '/v3/')
    );
    const iiifManifestPromise = getIIIFManifest(iiifPresentationLocation.url);

    const [iiifManifestV3, iiifManifest] = await Promise.all([
      iiifManifestV3Promise,
      iiifManifestPromise,
    ]);

    if (iiifManifest && iiifManifestV3) {
      return parseManifest(
        iiifManifest as IIIFManifest,
        iiifManifestV3 as Manifest
      );
    }
  } catch (e) {}
}

const manifestDataPromises: Map<
  string,
  Promise<IIIFManifestData | undefined>
> = new Map();
const cachedManifestData: Map<string, IIIFManifestData> = new Map();
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

const useIIIFManifestData = (work: Work): IIIFManifestData => {
  const [manifestData, setManifestData] = useState<IIIFManifestData>({
    imageCount: 0,
    childManifestsCount: 0,
    audio: {
      sounds: [],
    },
    manifestV3: blankManifestV3,
  });

  async function updateManifest(work) {
    const cachedManifest = cachedManifestData.get(work.id);
    if (cachedManifest) {
      setManifestData(cachedManifest);
    } else {
      // If we've started fetching a work, we can just wait for that to resolve
      const existingPromise = manifestDataPromises.get(work.id);
      if (existingPromise) {
        const data = await existingPromise;
        if (data) {
          cachedManifestData.set(work.id, data);
          setManifestData(data);
        }
      } else {
        manifestDataPromises.set(work.id, fetchIIIFPresentationManifest(work));
        const data = await manifestDataPromises.get(work.id);
        if (data) {
          cachedManifestData.set(work.id, data);
          setManifestData(data);
        }
      }
    }
  }
  useEffect(() => {
    updateManifest(work);
  }, [work.id]);

  return manifestData;
};

export default useIIIFManifestData;
