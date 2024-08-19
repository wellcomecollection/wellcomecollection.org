import {
  Service,
  AuthExternalService,
  Range,
  AuthClickThroughService,
  AuthAccessTokenService,
  CollectionItems,
  InternationalString,
  SpecificationBehaviors,
  ChoiceBody,
  ContentResource,
  ResourceType,
  Manifest,
  MetadataItem,
  AuthAccessService2_External as AuthAccessService2External,
  AuthAccessTokenService2,
} from '@iiif/presentation-3';
import { AuthAccessService2WithInteractiveProfile } from '@weco/content/utils/iiif/v3';

export type ThumbnailImage = { url: string; width: number };

export type Original = {
  originalFile: string | undefined;
  label: InternationalString | null | undefined;
  format: string | undefined;
};

export type TransformedCanvas = {
  id: string;
  type: NonNullable<ResourceType>;
  width: number | undefined;
  height: number | undefined;
  imageServiceId: string | undefined;
  hasRestrictedImage: boolean;
  label: string | undefined;
  textServiceId: string | undefined;
  thumbnailImage: ThumbnailImage | undefined;
  painting: (ChoiceBody | ContentResource)[];
  original: CustomContentResource[];
  supplementing: (ChoiceBody | ContentResource)[];
  metadata: MetadataItem[];
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

export type BornDigitalStatus =
  | 'allBornDigital'
  | 'noBornDigital'
  | 'mixedBornDigital';

export type TransformedRange = Omit<Range, 'items'> & {
  items: (TransformedRange | TransformedCanvas)[];
};

export type TransformedManifest = {
  firstCollectionManifestLocation?: string;
  bornDigitalStatus: BornDigitalStatus;
  title: string;
  id: string;
  services: Service[];
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
  structures: Manifest['structures'];
  manifests: CollectionItems[];
  clickThroughService:
    | AuthClickThroughServiceWithPossibleServiceArray
    | undefined;
  tokenService: AuthAccessTokenService | undefined;
  placeholderId: string | undefined;
  rendering: ContentResource[];
  externalAccessService: AuthAccessService2External | undefined;
  activeAccessService: AuthAccessService2WithInteractiveProfile | undefined;
  v2TokenService: AuthAccessTokenService2 | undefined;
};

export type CustomSpecificationBehaviors =
  | SpecificationBehaviors
  | 'placeholder';

export type CustomContentResource = ContentResource & {
  behavior: 'original';
} & { type?: string; format?: string };
