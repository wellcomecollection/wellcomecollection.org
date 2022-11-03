import {
  IIIFMediaElement,
  AuthService as AuthService2,
  AuthServiceService,
  CollectionManifest,
} from '../../webapp/services/iiif/types/manifest/v2';
import { Service, AuthExternalService, Range } from '@iiif/presentation-3';
import { Audio } from '../../webapp/services/iiif/types/manifest/v3';

type ThumbnailImage = { url: string | undefined; width: number };

export type TransformedCanvas = {
  id: string;
  width: number | undefined;
  height: number | undefined;
  imageServiceId: string | undefined;
  hasRestrictedImage: boolean;
  label: string | undefined;
  textServiceId: string | undefined;
  thumbnailImage: ThumbnailImage | undefined;
};
// TODO now these are all in one place, it's easier to see we may not need them all
// For example:
// Do we need collectionManifestsCount and isCollectionManifest?
// These should be cleaned up as we move to v3

export type DownloadOption = {
  id: string;
  label: string;
  format: string;
  width?: 'full' | number;
};

export type TransformedManifest = {
  // Currently from iiifManifest V2:
  id: string;
  title: string;
  canvasCount: number;
  collectionManifestsCount: number;
  video?: IIIFMediaElement;
  iiifCredit?: string;
  downloadEnabled?: boolean;
  firstCollectionManifestLocation?: string;
  authService: AuthService2 | undefined;
  tokenService: AuthServiceService | undefined;
  isAnyImageOpen: boolean;
  isTotallyRestricted: boolean;
  isCollectionManifest: boolean;
  manifests: CollectionManifest[];
  parentManifestUrl: string | undefined;
  needsModal: boolean;
  // Currently from iiif manifest v3:
  audio: Audio | undefined;
  services: Service[];
  downloadOptions: DownloadOption[];
  pdf: DownloadOption | undefined;
  canvases: TransformedCanvas[];
  restrictedService: AuthExternalService | undefined;
  searchService: Service | undefined;
  structures: Range[];
};

export function createDefaultTransformedManifest(): TransformedManifest {
  return {
    id: '',
    title: '',
    canvasCount: 0,
    collectionManifestsCount: 0,
    downloadEnabled: true,
    downloadOptions: [],
    pdf: undefined,
    authService: undefined,
    tokenService: undefined,
    isAnyImageOpen: true,
    isTotallyRestricted: false,
    isCollectionManifest: false,
    manifests: [],
    canvases: [],
    parentManifestUrl: undefined,
    needsModal: false,
    searchService: undefined,
    structures: [],
    audio: {
      sounds: [],
    },
    services: [],
    restrictedService: undefined,
  };
}
