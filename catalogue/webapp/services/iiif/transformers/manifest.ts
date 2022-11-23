import { IIIFManifests } from '../fetch/manifest';
import { TransformedManifest, DownloadOption } from '../../../types/manifest';
// TODO move each of these util functions from v2 to v3
import {
  getAuthService,
  getTokenService,
  checkModalRequired,
  checkIsTotallyRestricted,
} from '../../../utils/iiif/v2';

import {
  getAudio,
  getDownloadOptionsFromManifest,
  getFirstCollectionManifestLocation,
  getPdf,
  getTitle,
  getTransformedCanvases,
  checkIsAnyImageOpen,
  getRestricedLoginService,
  getIIIFPresentationCredit,
  getSearchService,
  getVideo,
  hasPdfDownload,
} from '../../../utils/iiif/v3';

export function transformManifest(
  iiifManifests: IIIFManifests
): TransformedManifest {
  const { manifestV2, manifestV3 } = { ...iiifManifests };

  const authService = getAuthService(manifestV2);
  const tokenService = authService && getTokenService(authService);
  const manifests = manifestV2?.manifests || [];

  // V3
  const title = getTitle(manifestV3?.label);
  const audio = getAudio(manifestV3);
  const services = manifestV3?.services || [];
  const iiifCredit = getIIIFPresentationCredit(manifestV3);
  const video = getVideo(manifestV3);
  const downloadOptions = getDownloadOptionsFromManifest(manifestV3);
  const pdf = getPdf(manifestV3);
  const id = manifestV3?.id || '';
  const parentManifestUrl = manifestV3?.partOf?.[0].id;
  const collectionManifestsCount =
    manifestV3?.items?.filter(c => c.type === 'Manifest')?.length || 0;
  const transformedCanvases = getTransformedCanvases(manifestV3);
  const canvasCount = transformedCanvases.length;
  const isAnyImageOpen = checkIsAnyImageOpen(transformedCanvases);
  const restrictedService = getRestricedLoginService(manifestV3);
  const firstCollectionManifestLocation =
    manifestV3 && getFirstCollectionManifestLocation(manifestV3);

  // TODO next
  const isTotallyRestricted = checkIsTotallyRestricted(
    authService,
    isAnyImageOpen
  );
  const needsModal = checkModalRequired(authService, isAnyImageOpen);
  const searchService = getSearchService(manifestV3);
  const structures = manifestV3?.structures || [];
  const isCollectionManifest = Boolean(manifestV3?.type === 'Collection');
  const downloadEnabled = manifestV3 ? hasPdfDownload(manifestV3) : false;

  // TODO As we move over, further transform the props to exactly what we need
  return {
    // Taken from V2 manifest:
    authService,
    tokenService,
    isTotallyRestricted,
    needsModal,
    manifests,
    // Taken from V3 manifest:
    id,
    audio,
    services,
    iiifCredit,
    video,
    downloadOptions: [...downloadOptions, pdf].filter(
      Boolean
    ) as DownloadOption[], // We add the PDF for items that are PDFs, otherwise they'd have no download option
    firstCollectionManifestLocation,
    pdf,
    parentManifestUrl,
    title,
    collectionManifestsCount,
    isAnyImageOpen,
    canvases: transformedCanvases,
    canvasCount,
    restrictedService,
    searchService,
    structures,
    isCollectionManifest,
    downloadEnabled,
  };
}
