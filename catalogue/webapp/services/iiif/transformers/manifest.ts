// TODO put these in v2 and v3 folders?
import {
  // used in both item.tsx and useIIIFManifestData.ts
  getDownloadOptionsFromManifest,
  getUiExtensions,
  getVideo,
  isUiEnabled,
  // used in useIIIFManifestData
  getCanvases,
  getFirstChildManifestLocation,
  getIIIFPresentationCredit,
  // used in items
  getAuthService,
  getTokenService,
  getIsAnyImageOpen,
  getSearchService,
  restrictedAuthServiceUrl, // TODO move this here? don't think it is used elsewhere
} from '../../../utils/iiif';
} from '../../../utils/iiif/v2';
import { getAudioV3 } from '../../../utils/iiif/v3';
import { Manifest } from '@iiif/presentation-3';
// TODO replace the following with provided iiif3 types
import {
  IIIFManifest,
  AudioV3,
  IIIFMediaElement,
  IIIFRendering,
  AuthService,
} from '../../../model/iiif';

// TODO NEXT NEXT check all types and if they should really optional
// TODO move type elsewhere? - mirror content app
export type ManifestData = {
  v2: {
    title: string;
    imageCount: number;
    childManifestsCount: number;
    video?: IIIFMediaElement;
    iiifCredit?: string;
    iiifPresentationDownloadOptions?: IIIFRendering[];
    iiifDownloadEnabled?: boolean;
    firstChildManifestLocation?: string;
    showDownloadOptions: boolean; // TODO do we need this and iiifDownloadEnabled?
    downloadOptions: any; // TODO type properly
    // [
    //   {
    //     "@id": "https://iiif.wellcomecollection.org/pdf/b31362758",
    //     "label": "View as PDF",
    //     "format": "application/pdf"
    //   },
    //   {
    //     "@id": "https://api.wellcomecollection.org/text/v1/b31362758",
    //     "label": "View raw text",
    //     "format": "text/plain"
    //   }
    // ],
    pdfRendering: any; // TODO type properly
    authService: any; // TODO type properly
    tokenService: any; // TODO type properly
    isAnyImageOpen: boolean; // TODO type properly
    isTotallyRestricted: boolean; // TODO type properly
    isCollectionManifest: boolean; // TODO not this, can we use childManifestCount, is it ultimately the same thing
    manifests: any; // TODO type properly
    canvases: any; // TODO type properly
    parentManifestUrl: string | undefined;
    needsModal: any; // TODO type properly
    searchService: any; // TODO type properly
    structures: any; // TODO type properly
  };
  v3: {
    audio: AudioV3;
    services: any[]; // TODO
  };
};

function checkModalRequired(
  authService: AuthService | undefined,
  isAnyImageOpen: boolean
) {
  switch (authService?.['@id']) {
    case undefined:
      return false;
    case restrictedAuthServiceUrl:
      return !isAnyImageOpen;
    default:
      return true;
  }
}

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
  const isTotallyRestricted =
    authService?.['@id'] === restrictedAuthServiceUrl && !isAnyImageOpen;
  const isCollectionManifest = manifest['@type'] === 'sc:Collection';
  const canvases =
    manifest.sequences && manifest.sequences[0].canvases
      ? manifest.sequences[0].canvases
      : [];
  const parentManifestUrl = manifest && manifest.within;
  const needsModal = checkModalRequired(authService, isAnyImageOpen);
  const searchService = manifest && getSearchService(manifest);
  const manifests = manifest?.manifests || [];
  const structures = manifest?.structures || [];
  // V3
  const audio = manifestV3 && getAudioV3(manifestV3);
  const services = manifestV3?.services || [];
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
