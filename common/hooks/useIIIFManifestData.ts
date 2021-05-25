import { useEffect, useState } from 'react';
import {
  getAudio,
  getCanvases,
  getDownloadOptionsFromManifest,
  getFirstChildManifestLocation,
  getIIIFPresentationCredit,
  getUiExtensions,
  getVideo,
  isUiEnabled,
  getIIIFManifest,
} from '../utils/iiif';
import { Work } from '../model/catalogue';
import { IIIFManifest, IIIFMediaElement, IIIFRendering } from '../model/iiif';
import { getDigitalLocationOfType } from '../utils/works';

type IIIFManifestData = {
  imageCount: number;
  childManifestsCount: number;
  audio?: IIIFMediaElement;
  video?: IIIFMediaElement;
  iiifCredit?: string;
  iiifPresentationDownloadOptions?: IIIFRendering[];
  iiifDownloadEnabled?: boolean;
  firstChildManifestLocation?: string;
};

function parseManifest(manifest: IIIFManifest): IIIFManifestData {
  const imageCount = getCanvases(manifest).length;
  const childManifestsCount = manifest.manifests
    ? manifest.manifests.length
    : 0;
  const audio = getAudio(manifest);
  const video = getVideo(manifest);
  const iiifCredit = getIIIFPresentationCredit(manifest);
  const iiifPresentationDownloadOptions = getDownloadOptionsFromManifest(
    manifest
  );
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
  };
}

const startedFetchingIds = new Set();
const manifestDataPromises: Map<
  string,
  Promise<IIIFManifestData | undefined>
> = new Map();
const cachedManifestData: Map<string, IIIFManifestData> = new Map();

const useIIIFManifestData = (work: Work): IIIFManifestData => {
  const [manifestData, setManifestData] = useState<IIIFManifestData>({
    imageCount: 0,
    childManifestsCount: 0,
  });

  async function fetchIIIFPresentationManifest(
    work: Work
  ): Promise<IIIFManifestData | undefined> {
    startedFetchingIds.add(work.id);
    try {
      const iiifPresentationLocation = getDigitalLocationOfType(
        work,
        'iiif-presentation'
      );

      const iiifManifest =
        iiifPresentationLocation &&
        (await getIIIFManifest(iiifPresentationLocation.url));

      if (iiifManifest) {
        return parseManifest(iiifManifest);
      }
    } catch (e) {}
  }

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
