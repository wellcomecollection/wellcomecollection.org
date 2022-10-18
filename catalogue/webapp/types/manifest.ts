import {
  IIIFMediaElement,
  IIIFRendering,
  IIIFCanvas,
  IIIFStructure,
  AuthService,
  AuthServiceService,
  CollectionManifest,
  Service as Service2,
} from '../../webapp/services/iiif/types/manifest/v2';
import { Service } from '@iiif/presentation-3';
import { Audio } from '../../webapp/services/iiif/types/manifest/v3';

// TODO now these are all in one place, it's easier to see we may not need them all
// For example:
// Do we need iiifPresentationDownloadOptions and downloadOptions?
// Do we need searchService and services?
// Do we need collectionManifestsCount and isCollectionManifest?
// Do we need canvases and canvasCount?
// DO we need showDownloadOptions and iiifDownloadEnabled?
// These should be cleaned up as we move to v3
export type TransformedManifest = {
  // Currently from iiifManifest V2:
  title: string;
  canvasCount: number;
  collectionManifestsCount: number;
  video?: IIIFMediaElement;
  iiifCredit?: string;
  iiifPresentationDownloadOptions?: IIIFRendering[];
  iiifDownloadEnabled?: boolean;
  firstCollectionManifestLocation?: string;
  showDownloadOptions: boolean; // TODO do we need this and iiifDownloadEnabled?
  downloadOptions: IIIFRendering[];
  pdfRendering: IIIFRendering | undefined;
  authService: AuthService | undefined;
  tokenService: AuthServiceService | undefined;
  isAnyImageOpen: boolean;
  isTotallyRestricted: boolean;
  isCollectionManifest: boolean;
  manifests: CollectionManifest[];
  canvases: IIIFCanvas[];
  parentManifestUrl: string | undefined;
  needsModal: boolean;
  searchService: Service2 | undefined;
  structures: IIIFStructure[];
  // Currently from iiif manifest v3:
  id: string;
  audio: Audio | undefined;
  services: Service[];
};

export function createDefaultTransformedManifest(): TransformedManifest {
  return {
    id: '',
    title: '',
    canvasCount: 0,
    collectionManifestsCount: 0,
    showDownloadOptions: true,
    downloadOptions: [],
    pdfRendering: undefined,
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
