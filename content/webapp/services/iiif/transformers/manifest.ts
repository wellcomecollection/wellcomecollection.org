import { TransformedManifest } from '@weco/content/types/manifest';
import { Manifest, Collection } from '@iiif/presentation-3';
import {
  getFirstCollectionManifestLocation,
  getTitle,
  getTransformedCanvases,
  checkIsAnyImageOpen,
  getRestrictedLoginService,
  getIIIFPresentationCredit,
  getSearchService,
  getClickThroughService,
  getTokenService,
  getCollectionManifests,
  checkModalRequired,
  checkIsTotallyRestricted,
  getBornDigitalStatus,
  groupRanges,
  getAnnotationsOfMotivation,
  getDisplayData,
  isCollection,
  getStructures,
  getAuthAccessServices,
  getExternalAuthAccessService,
  // getActiveAuthAccessService,
  // getV2TokenService,
} from '@weco/content/utils/iiif/v3';

export function transformManifest(
  manifestV3: Manifest | Collection
): TransformedManifest {
  const title = getTitle(manifestV3.label);
  const services = manifestV3.services || [];
  const iiifCredit = getIIIFPresentationCredit(manifestV3);
  const id = manifestV3.id || '';
  const parentManifestUrl = manifestV3.partOf?.[0].id;
  const manifests = getCollectionManifests(manifestV3);
  const collectionManifestsCount = manifests.length;
  const transformedCanvases = getTransformedCanvases(manifestV3);
  const canvasCount = transformedCanvases.length;
  const isAnyImageOpen = checkIsAnyImageOpen(transformedCanvases);
  // Our manifests reference both the v1 and v2 Auth services.
  // This is to make it easier to switch from the current Auth implementation to the new one.
  // We are currently using v1 for everything (except logging in for restricted items).
  // The following are taken from the v1 services:
  const restrictedService = getRestrictedLoginService(manifestV3);
  const clickThroughService = getClickThroughService(manifestV3);
  const tokenService = getTokenService(
    clickThroughService || restrictedService
  );
  // We should migrate everything to using v2*.
  // At the moment we will only use v2 to login to see restricted items.
  // *When we do shift to v2 for everything
  // we may need to try using v2 but fall back to v1.
  // This is because it seems not all manifests have the v2 services present yet.
  // see https://wellcome.slack.com/archives/CBT40CMKQ/p1721912291057799 where a manifest needed to be regenerated to start including the v2 services (This needs clarification)
  // The following are taken from the v2 services:
  const authAccessServices = getAuthAccessServices(manifestV3);
  // equivalent of restrictedService
  const externalAccessService =
    getExternalAuthAccessService(authAccessServices);
  // equivalent of clickThroughService
  // const activeAccessService = getActiveAuthAccessService(authAccessServices);
  // equivalent of tokenService
  // const v2TokenService = getV2TokenService(activeAccessService); // TODO or external service?

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
  const structures = getStructures(manifestV3);
  const groupedStructures = groupRanges(
    transformedCanvases || [],
    structures || []
  );

  const bornDigitalStatus = getBornDigitalStatus(manifestV3);
  // Manifests can have a placeholderCanvas: https://iiif.io/api/presentation/3.0/#placeholdercanvas
  // "...that provides additional content for use before the main content of the resource.."
  // We use this to provide a poster image for video content.
  // In future, we may want to use it to display an image for audio content too,
  // but we don't so this at present because many of them are a generic speaker gif,
  // e.g. https://iiif.wellcomecollection.org/posters/audioplaceholder.png, which we don't want to display.
  // The underlying placeholderCanvas data would have to change to remove these.
  const placeholderCanvasPaintings = getAnnotationsOfMotivation(
    manifestV3.placeholderCanvas?.items || [],
    'painting'
  );

  // We use this to provide a poster image for video content.
  // We are only interested in the first one.
  // In reality there is probably only ever one available.
  // We don't use them for audio content because they either don't exist or are probably a generic speaker gif.
  // For interest, the only audio with a real image is /works/tp9njewm
  const firstPlaceholderId = placeholderCanvasPaintings
    .map(getDisplayData)
    .flat()[0]?.id;

  // Manifests can have a rendering property: https://iiif.io/api/presentation/3.0/#rendering
  // "...an alternative, non - IIIF representation of the resource"
  // We use this to provide a transcript for audio files for example.
  const rendering = manifestV3.rendering || [];

  const contextArray = Array.isArray(manifestV3?.['@context'])
    ? manifestV3?.['@context']
    : [manifestV3?.['@context']];
  const hasAuthFlow = contextArray.some(
    item => item === 'http://iiif.io/api/auth/2/context.json'
  );

  return {
    bornDigitalStatus,
    id,
    firstCollectionManifestLocation,
    services,
    iiifCredit,
    parentManifestUrl,
    title,
    manifests,
    collectionManifestsCount,
    isAnyImageOpen,
    canvases: transformedCanvases,
    canvasCount,
    structures: groupedStructures,
    isCollectionManifest: isCollection(manifestV3),
    searchService,
    clickThroughService, // TODO redo this - where used - keep but for now but favour new and fallback to this?
    tokenService, // TODO redo this - where used - keep but for now but favour new and fallback to this?
    restrictedService, // TODO redo this - where used - keep but for now but favour new and fallback to this?
    isTotallyRestricted, // TODO redo this - may not need to? - where used - keep but for now but favour new and fallback to this?
    needsModal,
    placeholderId: firstPlaceholderId,
    rendering,
    hasAuthFlow, // TODO not needed now have externalAccessService
    externalAccessService,
    // TODO need probe services etc. on Canvas?
    // AuthServices - interactive, active
    // TODO If more than one access service is available, the client should interact with them in the order external, (kiosk - not needed for us), active - this will need to interact with the toggle?
    // TODO does this mean we have to redo everything to use v2?
  };
}
