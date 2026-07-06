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

export const defaultMockAuth: Auth = {
  externalAccessService: undefined,
  activeAccessService: undefined,
  tokenService: undefined,
  accessRequirements: ['Open'],
};

export function createMockManifest(
  overrides: Partial<TransformedManifest> = {}
): TransformedManifest {
  const canvases = overrides.canvases ?? [createMockCanvas()];

  return {
    itemsStatus: 'allStandard',
    title: 'Test manifest',
    id: 'https://iiif.wellcomecollection.org/presentation/v3/b00000000',
    canvases,
    canvasCount: canvases.length,
    collectionManifestsCount: 0,
    isCollectionManifest: false,
    structures: [],
    manifests: [],
    rendering: [],
    auth: { ...defaultMockAuth },
    ...overrides,
  };
}
