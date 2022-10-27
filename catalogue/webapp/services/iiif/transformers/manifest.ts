import { IIIFManifests } from '../fetch/manifest';
import { TransformedManifest } from '../../../types/manifest';
// TODO move each of these util functions from v2 to v3
import {
  getDownloadOptionsFromManifest,
  getUiExtensions,
  isUiEnabled,
  getCanvases,
  getFirstCollectionManifestLocation,
  getIIIFPresentationCredit,
  getSearchService,
} from '../../../utils/iiif/v2';
import {
  getAudio,
  getTitle,
  getVideo,
  getAuthService,
  getTokenService,
  getIsAnyImageOpen,
  checkIsTotallyRestricted,
  checkModalRequired,
} from '../../../utils/iiif/v3';

export function transformManifest(
  iiifManifests: IIIFManifests
): TransformedManifest {
  const { manifestV2, manifestV3 } = { ...iiifManifests };

  // V2
  // TODO Be aware when moving the id to v3 the id value changes, the id string will no longer contain /v2/
  // This causes the matchingManifest not to be found in IIIFViewer
  const id = manifestV2 ? manifestV2['@id'] : '';
  const canvases = manifestV2 ? getCanvases(manifestV2) : [];
  const canvasCount = canvases.length;
  const iiifCredit = manifestV2 && getIIIFPresentationCredit(manifestV2);
  const downloadEnabled = manifestV2
    ? isUiEnabled(getUiExtensions(manifestV2), 'mediaDownload')
    : true;
  const downloadOptions = manifestV2
    ? getDownloadOptionsFromManifest(manifestV2)
    : [];
  const firstCollectionManifestLocation =
    manifestV2 && getFirstCollectionManifestLocation(manifestV2);

  const pdfRendering =
    downloadOptions &&
    downloadOptions.find(option => option.label === 'Download PDF');

  const isCollectionManifest = manifestV2
    ? manifestV2['@type'] === 'sc:Collection'
    : false;
  const parentManifestUrl = manifestV2 && manifestV2.within;
  const searchService = manifestV2 && getSearchService(manifestV2);
  const manifests = manifestV2?.manifests || [];
  const structures = manifestV2?.structures || [];

  // V3
  const title = manifestV3?.label ? getTitle(manifestV3.label) : '';
  const audio = manifestV3 && getAudio(manifestV3);
  const services = manifestV3?.services || [];
  const video = manifestV3 && getVideo(manifestV3);
  const collectionManifestsCount = manifestV3?.items?.length || 0;

  const authService = manifestV3 && getAuthService(manifestV3);
  const tokenService =
    manifestV3 && authService?.['@id']
      ? getTokenService(authService?.['@id'], manifestV3.services)
      : undefined;
  const isAnyImageOpen = manifestV3 ? getIsAnyImageOpen(manifestV3) : false;
  const isTotallyRestricted = checkIsTotallyRestricted(
    authService,
    isAnyImageOpen
  );
  const needsModal = checkModalRequired(authService, isAnyImageOpen);

  // TODO As we move over, further transform the props to exactly what we need
  return {
    // Taken from V2 manifest:
    id,
    canvasCount,
    iiifCredit,
    downloadEnabled,
    downloadOptions,
    firstCollectionManifestLocation,
    pdfRendering,
    isCollectionManifest,
    manifests,
    canvases,
    parentManifestUrl,
    searchService,
    structures,
    // Taken from V3 manifest:
    title,
    audio,
    tokenService,
    services,
    video,
    collectionManifestsCount,
    authService,
    isAnyImageOpen,
    isTotallyRestricted,
    needsModal,
  };
}
