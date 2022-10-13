import {
  getDownloadOptionsFromManifest,
  getUiExtensions,
  getVideo,
  isUiEnabled,
  getCanvases,
  getFirstChildManifestLocation,
  getIIIFPresentationCredit,
  getAuthService,
  getTokenService,
  getIsAnyImageOpen,
  getSearchService,
  checkModalRequired,
  checkIsTotallyRestricted,
} from '../../../utils/iiif/v2';
import { getAudioV3 } from '../../../utils/iiif/v3';
import { Manifest } from '@iiif/presentation-3';
// TODO replace the following with iiif3 types
import { IIIFManifest } from '../types/manifest/v2';
import { ManifestData } from '../../../types/manifest';

export function transformManifest(
  manifest: IIIFManifest,
  manifestV3: Manifest
): ManifestData {
  // TODO change manifest, manifestData to transformedManifest everywhere
  // TODO comments explaining each of these
  // V2
  const title = manifest && manifest.label;
  const imageCount = getCanvases(manifest).length;
  const childManifestsCount = manifest.manifests
    ? manifest.manifests.length
    : 0;
  const video = getVideo(manifest);
  const iiifCredit = getIIIFPresentationCredit(manifest);
  const iiifPresentationDownloadOptions =
    getDownloadOptionsFromManifest(manifest);
  const iiifDownloadEnabled = isUiEnabled(
    getUiExtensions(manifest),
    'mediaDownload'
  );
  const firstChildManifestLocation = getFirstChildManifestLocation(manifest);
  const showDownloadOptions = manifest
    ? isUiEnabled(getUiExtensions(manifest), 'mediaDownload')
    : true;
  const downloadOptions =
    showDownloadOptions && manifest && getDownloadOptionsFromManifest(manifest);

  const pdfRendering =
    (downloadOptions &&
      downloadOptions.find(option => option.label === 'Download PDF')) ||
    null;
  const authService = getAuthService(manifest);
  const tokenService = authService && getTokenService(authService);
  const isAnyImageOpen = manifest && getIsAnyImageOpen(manifest);
  const isTotallyRestricted = checkIsTotallyRestricted(
    authService,
    isAnyImageOpen
  );

  const isCollectionManifest = manifest['@type'] === 'sc:Collection';
  const canvases = getCanvases(manifest);
  const parentManifestUrl = manifest && manifest.within;
  const needsModal = checkModalRequired(authService, isAnyImageOpen);
  const searchService = manifest && getSearchService(manifest);
  const manifests = manifest?.manifests || []; // TODO use getManifests - does this exist?
  const structures = manifest?.structures || []; // TODO getStructures
  // V3
  const audio = manifestV3 && getAudioV3(manifestV3);
  const services = manifestV3?.services || []; // TODO getServices - does this exist?
  return {
    v2: {
      title,
      imageCount,
      childManifestsCount,
      video,
      iiifCredit,
      iiifPresentationDownloadOptions,
      iiifDownloadEnabled,
      firstChildManifestLocation,
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
    },
    // TODO move everything in v2 to v3, then remove v2
    v3: {
      audio,
      services,
    },
  };
}
