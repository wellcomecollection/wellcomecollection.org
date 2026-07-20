import type {
  ChoiceBody,
  CollectionItems,
  ContentResource,
  Manifest,
  MetadataItem,
  Range,
  ResourceType,
  SearchService,
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

import type { TransformedAuthService } from '@weco/content/utils/iiif/v3';

export type ThumbnailImage = { url: string; width: number };

export type TransformedCanvas = {
  id: string;
  type: NonNullable<ResourceType>;
  width: number | undefined;
  height: number | undefined;
  imageServiceId: string | undefined;
  probeServiceId?: string;
  label: string | undefined;
  textServiceId: string | undefined;
  thumbnailImage: ThumbnailImage | undefined;
  painting: (ChoiceBody | ContentResource)[];
  original: CustomContentResource[];
  rendering: ContentResource[];
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
  'allStandard' | 'noStandard' | 'mixedStandardAndNonStandard';

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
  parentManifestUrl?: string;
  searchService?: SearchService;
  structures: Manifest['structures'];
  manifests: CollectionItems[];
  placeholderId?: string;
  rendering: ContentResource[];
  auth: Auth;
};

export type CustomSpecificationBehaviors =
  SpecificationBehaviors | 'placeholder';

export type CustomContentResource = ContentResource & {
  behavior: 'original';
} & { type?: string; format?: string };

// Some of our ContentResources can have a type of 'Audio':
// https://iiif.wellcomecollection.org/presentation/v3/b17276342
// However, the IIIF Presentation API spec only has a type of 'Sound'
// so we add 'Audio' to the type here.
export type IIIFItemProps =
  | (Omit<ContentResource, 'type'> & {
      type: ContentResource['type'] | 'Audio';
    })
  | CustomContentResource
  | ChoiceBody;
