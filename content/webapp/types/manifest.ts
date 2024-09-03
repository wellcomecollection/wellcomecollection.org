import {
  Service,
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
} from '@iiif/presentation-3';
import { TransformedAuthService } from '@weco/content/utils/iiif/v3';

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

export type Auth = {
  v1: {
    externalAccessService: TransformedAuthService | undefined;
    activeAccessService: TransformedAuthService | undefined;
    tokenService: TransformedAuthService | undefined;
    isTotallyRestricted: boolean;
  };
  v2: {
    externalAccessService: TransformedAuthService | undefined;
    activeAccessService: TransformedAuthService | undefined;
    tokenService: TransformedAuthService | undefined;
    isTotallyRestricted: boolean;
  };
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
  isCollectionManifest: boolean;
  parentManifestUrl: string | undefined;
  searchService: Service | undefined;
  structures: Manifest['structures'];
  manifests: CollectionItems[];
  placeholderId: string | undefined;
  rendering: ContentResource[];
  auth: Auth;
};

export type CustomSpecificationBehaviors =
  | SpecificationBehaviors
  | 'placeholder';

export type CustomContentResource = ContentResource & {
  behavior: 'original';
} & { type?: string; format?: string };
