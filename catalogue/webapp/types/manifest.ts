import {
  Service,
  AuthExternalService,
  Range,
  AuthClickThroughService,
  AuthAccessTokenService,
  Canvas,
} from '@iiif/presentation-3';
import { Audio, Video } from '../../webapp/services/iiif/types/manifest/v3';

export type ThumbnailImage = { url: string; width: number };

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

export type DownloadOption = {
  id: string;
  label: string;
  format: string;
  width?: 'full' | number;
};

export type AuthClickThroughServiceWithPossibleServiceArray = Omit<
  AuthClickThroughService,
  'service'
> & {
  label?: string;
  description?: string;
  service: AuthAccessTokenService | AuthAccessTokenService[];
};

export type TransformedManifest = {
  // Currently from iiifManifest V2:
  downloadEnabled?: boolean;
  firstCollectionManifestLocation?: string;
  // Currently from iiif manifest v3:
  title: string;
  id: string;
  audio: Audio | undefined;
  video?: Video;
  services: Service[];
  downloadOptions: DownloadOption[];
  pdf: DownloadOption | undefined;
  canvases: TransformedCanvas[];
  canvasCount: number;
  collectionManifestsCount: number;
  iiifCredit?: string;
  isAnyImageOpen: boolean;
  isTotallyRestricted: boolean;
  isCollectionManifest: boolean;
  parentManifestUrl: string | undefined;
  needsModal: boolean;
  restrictedService: AuthExternalService | undefined;
  searchService: Service | undefined;
  structures: Range[];
  manifests: Canvas[];
  clickThroughService:
    | AuthClickThroughServiceWithPossibleServiceArray
    | undefined;
  tokenService: AuthAccessTokenService | undefined;
};
