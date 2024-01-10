import {
  TransformedManifest,
  DownloadOption,
} from '@weco/content/types/manifest';
import { Manifest } from '@iiif/presentation-3';
import {
  getAudio,
  getDownloadOptionsFromManifest,
  getFirstCollectionManifestLocation,
  getPdf,
  getTitle,
  getTransformedCanvases,
  checkIsAnyImageOpen,
  getRestrictedLoginService,
  getIIIFPresentationCredit,
  getSearchService,
  getVideo,
  hasPdfDownload,
  getClickThroughService,
  getTokenService,
  getCollectionManifests,
  checkModalRequired,
  checkIsTotallyRestricted,
  getBornDigitalStatus,
  groupRanges,
} from '@weco/content/utils/iiif/v3';

export function transformManifest(manifestV3: Manifest): TransformedManifest {
  const title = getTitle(manifestV3.label);
  const audio = getAudio(manifestV3);
  const services = manifestV3.services || [];
  const iiifCredit = getIIIFPresentationCredit(manifestV3);
  const video = getVideo(manifestV3);
  const downloadOptions = getDownloadOptionsFromManifest(manifestV3);
  const pdf = getPdf(manifestV3);
  const id = manifestV3.id || '';
  const parentManifestUrl = manifestV3.partOf?.[0].id;
  const manifests = getCollectionManifests(manifestV3);
  const collectionManifestsCount = manifests.length;
  const transformedCanvases = getTransformedCanvases(manifestV3);
  const canvasCount = transformedCanvases.length;
  const isAnyImageOpen = checkIsAnyImageOpen(transformedCanvases);
  const restrictedService = getRestrictedLoginService(manifestV3);
  const clickThroughService = getClickThroughService(manifestV3);
  const tokenService = getTokenService(
    clickThroughService || restrictedService
  );
  const firstCollectionManifestLocation =
    getFirstCollectionManifestLocation(manifestV3);
  const isTotallyRestricted = checkIsTotallyRestricted(
    restrictedService,
    isAnyImageOpen
  );
  const needsModal = checkModalRequired({
    clickThroughService,
    restrictedService,
    isAnyImageOpen,
  });
  const searchService = getSearchService(manifestV3);
  const structures = groupRanges(
    transformedCanvases || [],
    manifestV3.structures || []
  );
  const isCollectionManifest = manifestV3.type === 'Collection';
  const downloadEnabled = hasPdfDownload(manifestV3);
  const bornDigitalStatus = getBornDigitalStatus(manifestV3);

  return {
    bornDigitalStatus,
    id,
    firstCollectionManifestLocation,
    audio,
    services,
    iiifCredit,
    video,
    downloadOptions: [...downloadOptions, pdf].filter(
      Boolean
    ) as DownloadOption[], // We add the PDF for items that are PDFs, otherwise they'd have no download option
    pdf,
    parentManifestUrl,
    title,
    manifests,
    collectionManifestsCount,
    isAnyImageOpen,
    canvases: transformedCanvases,
    canvasCount,
    structures,
    isCollectionManifest,
    downloadEnabled,
    searchService,
    clickThroughService,
    tokenService,
    restrictedService,
    isTotallyRestricted,
    needsModal,
  };
}
