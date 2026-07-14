import { ItemViewerQuery } from '@weco/content/types/item-viewer';
import {
  Auth,
  TransformedCanvas,
  TransformedManifest,
} from '@weco/content/types/manifest';

// Factories for building the transformed data structures that the IIIF viewer
// components consume from ItemViewerContext.
//
// These deliberately mirror the output of the manifest/canvas transformers
// (services/iiif/transformers) rather than raw IIIF manifests, because that is
// the shape the components actually read. Each factory returns a minimal but
// valid default; pass `overrides` to characterise a specific scenario
// (restricted access, video/audio, PDF, born digital, multi-canvas etc.).

export function createMockCanvas(
  overrides: Partial<TransformedCanvas> = {}
): TransformedCanvas {
  return {
    id: 'https://iiif.wellcomecollection.org/presentation/v3/b00000000/canvases/b00000000_0001.jp2',
    type: 'Canvas',
    width: 1000,
    height: 1400,
    imageServiceId:
      'https://iiif.wellcomecollection.org/image/b00000000_0001.jp2',
    probeServiceId: undefined,
    label: '1',
    textServiceId: undefined,
    thumbnailImage: {
      url: 'https://iiif.wellcomecollection.org/thumbs/b00000000_0001.jp2/full/58%2C/0/default.jpg',
      width: 58,
    },
    painting: [],
    original: [],
    rendering: [],
    supplementing: [],
    metadata: [],
    ...overrides,
  };
}

// A factory (rather than a shared const) so every manifest gets its own auth
// object and its own `accessRequirements` array — keeping factory outputs
// isolated even if a test mutates them.
export function createMockAuth(overrides: Partial<Auth> = {}): Auth {
  return {
    externalAccessService: undefined,
    activeAccessService: undefined,
    tokenService: undefined,
    accessRequirements: ['Open'],
    ...overrides,
  };
}

// The restricted-login access service id the viewer inspects to decide whether
// a painting (and therefore the canvas) is restricted.
export const restrictedLoginId =
  'https://iiif.wellcomecollection.org/auth/v2/access/restrictedlogin';

// A painting item carrying the restricted-login access service, so
// isItemRestricted / hasRestrictedItem treat it as restricted.
export function createRestrictedPainting(
  overrides: Record<string, unknown> = {}
): TransformedCanvas['painting'][number] {
  return {
    id: 'https://example.com/image/restricted',
    type: 'Image',
    service: [
      {
        id: 'https://example.com/probe',
        type: 'AuthProbeService2',
        service: [{ id: restrictedLoginId, type: 'AuthAccessService2' }],
      },
    ],
    ...overrides,
  } as unknown as TransformedCanvas['painting'][number];
}

// A plain, unrestricted painting item.
export function createOpenPainting(
  overrides: Record<string, unknown> = {}
): TransformedCanvas['painting'][number] {
  return {
    id: 'https://example.com/image/open',
    type: 'Image',
    ...overrides,
  } as unknown as TransformedCanvas['painting'][number];
}

export function createMockQuery(
  overrides: Partial<ItemViewerQuery> = {}
): ItemViewerQuery {
  return {
    canvas: 1,
    manifest: 1,
    query: '',
    page: 1,
    shouldScrollToCanvas: true,
    ...overrides,
  };
}

export function createMockManifest(
  overrides: Partial<TransformedManifest> = {}
): TransformedManifest {
  const {
    canvases: overrideCanvases,
    auth: overrideAuth,
    ...restOverrides
  } = overrides;

  const canvases = overrideCanvases ?? [createMockCanvas()];
  const auth = overrideAuth ?? createMockAuth();

  return {
    itemsStatus: 'allStandard',
    title: 'Test manifest',
    id: 'https://iiif.wellcomecollection.org/presentation/v3/b00000000',
    collectionManifestsCount: 0,
    isCollectionManifest: false,
    structures: [],
    manifests: [],
    rendering: [],
    ...restOverrides,
    canvases,
    canvasCount: canvases.length,
    auth,
  };
}
