import { IIIFManifests } from '../fetch/manifest';
import { TransformedManifest, DownloadOption } from '../../../types/manifest';
// TODO move each of these util functions from v2 to v3
import {
  getUiExtensions,
  getVideo,
  isUiEnabled,
  getFirstCollectionManifestLocation,
  getIIIFPresentationCredit,
  getAuthService,
  getTokenService,
  checkModalRequired,
  checkIsTotallyRestricted,
} from '../../../utils/iiif/v2';

import {
  getAudio,
  getDownloadOptionsFromManifest,
  getPdf,
  getTitle,
  getTransformedCanvases,
  checkIsAnyImageOpen,
  getRestricedLoginService,
  getSearchService,
} from '../../../utils/iiif/v3';

export function transformManifest(
  iiifManifests: IIIFManifests
): TransformedManifest {
  const { manifestV2, manifestV3 } = { ...iiifManifests };

  const video = manifestV2 && getVideo(manifestV2);
  const iiifCredit = manifestV2 && getIIIFPresentationCredit(manifestV2);
  const downloadEnabled = manifestV2
    ? isUiEnabled(getUiExtensions(manifestV2), 'mediaDownload')
    : true;
  const firstCollectionManifestLocation =
    manifestV2 && getFirstCollectionManifestLocation(manifestV2);
  const authService = getAuthService(manifestV2);
  const tokenService = authService && getTokenService(authService);
  const isCollectionManifest = manifestV2
    ? manifestV2['@type'] === 'sc:Collection'
    : false;
  const manifests = manifestV2?.manifests || [];
  const structures = manifestV2?.structures || [];

  // V3
  const title = manifestV3?.label ? getTitle(manifestV3.label) : '';
  const audio = manifestV3 && getAudio(manifestV3);
  const services = manifestV3?.services || [];
  const downloadOptions = getDownloadOptionsFromManifest(manifestV3);
  const pdf = getPdf(manifestV3);
  const id = manifestV3?.id || '';
  const parentManifestUrl = manifestV3 && manifestV3.partOf?.[0].id;
  const collectionManifestsCount =
    manifestV3?.items?.filter(c => c.type === 'Manifest')?.length || 0;
  const transformedCanvases = getTransformedCanvases(manifestV3);
  const canvasCount = transformedCanvases.length;
  const isAnyImageOpen = checkIsAnyImageOpen(transformedCanvases);
  const restrictedService = getRestricedLoginService(manifestV3);

  // TODO next
  const isTotallyRestricted = checkIsTotallyRestricted(
    authService,
    isAnyImageOpen
  );
  const needsModal = checkModalRequired(authService, isAnyImageOpen);
  const searchService = getSearchService(manifestV3);

  // TODO As we move over, further transform the props to exactly what we need
  return {
    // Taken from V2 manifest:
    video,
    iiifCredit,
    downloadEnabled,
    authService,
    tokenService,
    isTotallyRestricted,
    isCollectionManifest,
    manifests,
    needsModal,
    structures,
    // Taken from V3 manifest:
    id,
    audio,
    services,
    downloadOptions: [...downloadOptions, pdf].filter(
      Boolean
    ) as DownloadOption[], // We add the PDF for items that are PDFs, otherwise they'd have no download option
    firstCollectionManifestLocation,
    pdf: pdf,
    parentManifestUrl,
    title,
    collectionManifestsCount,
    isAnyImageOpen,
    canvases: transformedCanvases,
    canvasCount,
    restrictedService,
    searchService,
  };
}
