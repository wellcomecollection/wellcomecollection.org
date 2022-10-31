import {
  IIIFCanvas,
  IIIFStructure,
  AuthService,
  AuthServiceService,
  CollectionManifest,
} from '../../webapp/services/iiif/types/manifest/v2';
import { Service } from '@iiif/presentation-3';
import { Audio, Video } from '../../webapp/services/iiif/types/manifest/v3';

// TODO now these are all in one place, it's easier to see we may not need them all
// For example:
// Do we need searchService and services?
// Do we need collectionManifestsCount and isCollectionManifest?
// Do we need canvases and canvasCount?
// These should be cleaned up as we move to v3

export type DownloadOption = {
  id: string;
  label: string;
  format: string;
  width?: 'full' | number;
};

export type TransformedManifest = {
  // Currently from iiifManifest V2:
  canvasCount: number;
  collectionManifestsCount: number;
  iiifCredit?: string;
  downloadEnabled?: boolean;
  firstCollectionManifestLocation?: string;
  authService: AuthService | undefined;
  tokenService: AuthServiceService | undefined;
  isAnyImageOpen: boolean;
  isTotallyRestricted: boolean;
  isCollectionManifest: boolean;
  manifests: CollectionManifest[];
  canvases: IIIFCanvas[];
  parentManifestUrl: string | undefined;
  needsModal: boolean;
  structures: IIIFStructure[];
  // Currently from iiif manifest v3:
  title: string;
  id: string;
  audio: Audio | undefined;
  video?: Video;
  services: Service[];
  downloadOptions: DownloadOption[];
  pdf: DownloadOption | undefined;
  searchService: Service | undefined;
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
  };
}
