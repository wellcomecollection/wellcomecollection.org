import { IIIFManifests } from '../fetch/manifest';
import { TransformedManifest } from '../../../types/manifest';
// TODO move each of these util functions from v2 to v3
import {
  getDownloadOptionsFromManifest,
  getUiExtensions,
  getVideo,
  isUiEnabled,
  getCanvases,
  getFirstCollectionManifestLocation,
  getIIIFPresentationCredit,
  getAuthService,
  getTokenService,
  getIsAnyImageOpen,
  getSearchService,
  checkModalRequired,
  checkIsTotallyRestricted,
} from '../../../utils/iiif/v2';
import { getAudio } from '../../../utils/iiif/v3';

export function transformManifest(
  iiifManifests: IIIFManifests
): TransformedManifest {
  const { manifestV2, manifestV3 } = { ...iiifManifests };

  // V2
  const title = manifestV2 ? manifestV2.label : '';
  const canvases = manifestV2 ? getCanvases(manifestV2) : [];
  const canvasCount = canvases.length;
  const collectionManifestsCount = manifestV2?.manifests
    ? manifestV2.manifests.length
    : 0;
  const video = manifestV2 && getVideo(manifestV2);
  const iiifCredit = manifestV2 && getIIIFPresentationCredit(manifestV2);
  const iiifPresentationDownloadOptions = manifestV2
    ? getDownloadOptionsFromManifest(manifestV2)
    : [];
  const iiifDownloadEnabled = manifestV2
    ? isUiEnabled(getUiExtensions(manifestV2), 'mediaDownload')
    : false;
  const firstCollectionManifestLocation =
    manifestV2 && getFirstCollectionManifestLocation(manifestV2);
  const showDownloadOptions = manifestV2
    ? isUiEnabled(getUiExtensions(manifestV2), 'mediaDownload')
    : true;
  const downloadOptions =
    (showDownloadOptions &&
      manifestV2 &&
      getDownloadOptionsFromManifest(manifestV2)) ||
    [];

  const pdfRendering =
    downloadOptions &&
    downloadOptions.find(option => option.label === 'Download PDF');
  const authService = getAuthService(manifestV2);
  const tokenService = authService && getTokenService(authService);
  const isAnyImageOpen = manifestV2 ? getIsAnyImageOpen(manifestV2) : false;
  const isTotallyRestricted = checkIsTotallyRestricted(
    authService,
    isAnyImageOpen
  );

  const isCollectionManifest = manifestV2
    ? manifestV2['@type'] === 'sc:Collection'
    : false;
  const parentManifestUrl = manifestV2 && manifestV2.within;
  const needsModal = checkModalRequired(authService, isAnyImageOpen);
  const searchService = manifestV2 && getSearchService(manifestV2);
  const manifests = manifestV2?.manifests || [];
  const structures = manifestV2?.structures || [];

  // V3
  const audio = manifestV3 && getAudio(manifestV3);
  const services = manifestV3?.services || [];

  // TODO As we move over, further transform the props to exactly what we need
  return {
    // Taken from V2 manifest:
    title,
    canvasCount,
    collectionManifestsCount,
    video,
    iiifCredit,
    iiifPresentationDownloadOptions,
    iiifDownloadEnabled,
    firstCollectionManifestLocation,
    showDownloadOptions,
    downloadOptions,
    pdfRendering,
    authService,
    tokenService,
    isAnyImageOpen,
    isTotallyRestricted,
    isCollectionManifest,
    manifests,
    canvases,
    parentManifestUrl,
    needsModal,
    searchService,
    structures,
    // Taken from V3 manifest:
    audio,
    services,
  };
}
