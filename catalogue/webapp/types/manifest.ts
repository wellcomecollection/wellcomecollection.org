import {
  IIIFMediaElement,
  IIIFRendering,
  IIIFCanvas,
} from '../../webapp/services/iiif/types/manifest/v2';
import { Audio } from '../../webapp/services/iiif/types/manifest/v3';

// TODO NEXT check all types and if they should really optional
// TODO fill in missing types
export type ManifestData = {
  // From iiifManifest V2:
  title: string;
  imageCount: number;
  childManifestsCount: number;
  video?: IIIFMediaElement;
  iiifCredit?: string;
  iiifPresentationDownloadOptions?: IIIFRendering[]; // TODO do we need this and downloadOptions? what is the difference
  iiifDownloadEnabled?: boolean;
  firstChildManifestLocation?: string;
  showDownloadOptions: boolean; // TODO do we need this and iiifDownloadEnabled?
  downloadOptions: IIIFRendering[];
  pdfRendering: any; // TODO type properly
  authService: any; // TODO type properly
  tokenService: any; // TODO type properly
  isAnyImageOpen: boolean; // TODO type properly
  isTotallyRestricted: boolean; // TODO type properly
  isCollectionManifest: boolean; // TODO not this, can we use childManifestCount, is it ultimately the same thing
  manifests: any; // TODO type properly
  canvases: IIIFCanvas[]; // TODO return values for all of these if iiif manifest is undefined.
  parentManifestUrl: string | undefined;
  needsModal: any; // TODO type properly
  searchService: any; // TODO type properly
  structures: any; // TODO type properly
  // From iiif manifest v3:
  audio: Audio | undefined;
  services: any[]; // TODO
};

export function createDefaultManifestData(): ManifestData {
  // TODO redo values once ManifestData type is settled
  return {
    title: '',
    imageCount: 0,
    childManifestsCount: 0,
    showDownloadOptions: false,
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
