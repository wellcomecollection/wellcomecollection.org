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
const cachedManifestData: Map<string, IIIFManifestData> = new Map();

const useIIIFManifestData = (work: Work): IIIFManifestData => {
  const [manifestData, setManifestData] = useState<IIIFManifestData>({
    imageCount: 0,
    childManifestsCount: 0,
  });

  useEffect(() => {
    const fetchIIIFPresentationManifest = async (work: Work) => {
      startedFetchingIds.add(work.id);
      try {
        const iiifPresentationLocation = getDigitalLocationOfType(
          work,
          'iiif-presentation'
        );

        const iiifManifestResp =
          iiifPresentationLocation &&
          (await fetch(iiifPresentationLocation.url));

        if (iiifManifestResp) {
          const iiifManifest = await iiifManifestResp.json();
          const data = parseManifest(iiifManifest);

          cachedManifestData.set(work.id, data);
          setManifestData(data);
        }
      } catch (e) {}
    };

    const cachedManifest = cachedManifestData.get(work.id);
    if (cachedManifest) {
      setManifestData(cachedManifest);
    }

    // If we've started fetching a work, we can just wait for that to resolve
    if (!startedFetchingIds.has(work.id)) {
      fetchIIIFPresentationManifest(work);
    }
  }, [work.id]);

  return manifestData;
};

export default useIIIFManifestData;
