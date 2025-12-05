import {
  ChoiceBody,
  CollectionItems,
  ContentResource,
  InternationalString,
  Manifest,
  MetadataItem,
  Range,
  ResourceType,
  Service,
  SpecificationBehaviors,
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

export type ItemsStatus =
  | 'allStandard'
  | 'noStandard'
  | 'mixedStandardAndNonStandard';

export type TransformedRange = Omit<Range, 'items'> & {
  items: (TransformedRange | TransformedCanvas)[];
};

export type Auth = {
  externalAccessService: TransformedAuthService | undefined;
  activeAccessService: TransformedAuthService | undefined;
  tokenService: TransformedAuthService | undefined;
  isTotallyRestricted: boolean;
};

export type TransformedManifest = {
  firstCollectionManifestLocation?: string;
  itemsStatus: ItemsStatus;
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
