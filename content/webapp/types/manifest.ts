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

export const allowedManifestAccessRequirements = [
  'Restricted files',
  'Open with advisory',
  'Open',
] as const;
export type ManifestAccessRequirement =
  (typeof allowedManifestAccessRequirements)[number];

// Augment IIIF Service type to include metadata property
// This is used for the access control hints service, which has metadata that we want to use to determine the access status of the manifest.
// See: https://github.com/wellcomecollection/platform/issues/5630
export type ServiceWithMetadata = Service & {
  metadata?: MetadataItem[];
};

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
  accessRequirements: ManifestAccessRequirement[];
};

export type TransformedManifest = {
  firstCollectionManifestLocation?: string;
  itemsStatus: ItemsStatus;
  title: string;
  id: string;
  canvases: TransformedCanvas[];
  canvasCount: number;
  collectionManifestsCount: number;
  iiifCredit?: string;
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
