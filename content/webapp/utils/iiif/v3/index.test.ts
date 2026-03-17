import { Manifest } from '@iiif/presentation-3';

import type { ServiceWithMetadata } from '@weco/content/types/manifest';
import type { TransformedCanvas } from '@weco/content/types/manifest';

import {
  getManifestAccessRequirements,
  hasNonImagesOrOriginals,
  transformLabel,
} from '.';

function createTestManifest(overrides: Partial<Manifest> = {}): Manifest {
  return {
    '@context': 'http://iiif.io/api/presentation/3/context.json',
    id: 'https://example.com/manifest',
    type: 'Manifest',
    label: {},
    summary: {},
    homepage: [],
    metadata: [],
    provider: [],
    seeAlso: [],
    services: [],
    items: [],
    partOf: [],
    ...overrides,
  };
}

describe('transformLabel', () => {
  test.each([
    {
      label: { en: ['Foundations for moral relativism / J. David Velleman.'] },
      expected: 'Foundations for moral relativism / J. David Velleman.',
    },
    { label: { none: ['-'] }, expected: undefined },
    { label: undefined, expected: undefined },
    {
      label: 'Foundations for moral relativism / J. David Velleman.',
      expected: 'Foundations for moral relativism / J. David Velleman.',
    },
  ])('the transformed label from $label is $expected', ({ label, expected }) =>
    expect(transformLabel(label)).toBe(expected)
  );
});

describe('getManifestAccessRequirements', () => {
  it('returns ["Restricted files"] for manifest with restricted access', () => {
    const manifest = createTestManifest({
      services: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/PPDBL/B/14#accesscontrolhints',
          type: 'Text',
          profile:
            'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
          label: {
            en: ['credentials'],
          },
          metadata: [
            {
              label: {
                en: ['Restricted files'],
              },
              value: {
                none: ['6'],
              },
            },
          ],
        } as unknown as ServiceWithMetadata,
      ],
    });

    const result = getManifestAccessRequirements(manifest);
    expect(result).toEqual(['Restricted files']);
  });

  it('returns ["Open"] for manifest with open access', () => {
    const manifest = createTestManifest({
      services: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/SASRH/B/41/2#accesscontrolhints',
          type: 'Text',
          profile:
            'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
          label: {
            en: ['open'],
          },
          metadata: [
            {
              label: {
                en: ['Open'],
              },
              value: {
                none: ['67'],
              },
            },
          ],
        } as unknown as ServiceWithMetadata,
      ],
    });

    const result = getManifestAccessRequirements(manifest);
    expect(result).toEqual(['Open']);
  });

  it('returns ["Open"] for manifest with no access control metadata', () => {
    const manifest = createTestManifest({
      services: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/b29823547#accesscontrolhints',
          type: 'Text',
          profile:
            'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
          label: {
            en: ['open'],
          },
        } as unknown as ServiceWithMetadata,
      ],
    });

    const result = getManifestAccessRequirements(manifest);
    expect(result).toEqual(['Open']);
  });

  it('returns ["Open"] for manifest with no services', () => {
    const manifest = createTestManifest({
      services: [],
    });

    const result = getManifestAccessRequirements(manifest);
    expect(result).toEqual(['Open']);
  });

  it('returns ["Open with advisory"] for manifest with advisory access', () => {
    const manifest = createTestManifest({
      services: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/example#accesscontrolhints',
          type: 'Text',
          profile:
            'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
          label: {
            en: ['clickthrough'],
          },
          metadata: [
            {
              label: {
                en: ['Open with advisory'],
              },
              value: {
                none: ['123'],
              },
            },
          ],
        } as unknown as ServiceWithMetadata,
      ],
    });

    const result = getManifestAccessRequirements(manifest);
    expect(result).toEqual(['Open with advisory']);
  });

  it('returns all access requirements when multiple are present', () => {
    const manifest = createTestManifest({
      services: [
        {
          id: 'https://iiif.wellcomecollection.org/presentation/example1#accesscontrolhints',
          type: 'Text',
          profile:
            'http://wellcomelibrary.org/ld/iiif-ext/access-control-hints',
          label: {
            en: ['credentials'],
          },
          metadata: [
            {
              label: {
                en: ['Restricted files'],
              },
              value: {
                none: ['6'],
              },
            },
            {
              label: {
                en: ['Open with advisory'],
              },
              value: {
                none: ['123'],
              },
            },
            {
              label: {
                en: ['Open'],
              },
              value: {
                none: ['67'],
              },
            },
          ],
        } as unknown as ServiceWithMetadata,
      ],
    });

    const result = getManifestAccessRequirements(manifest);
    expect(result).toEqual(['Restricted files', 'Open with advisory', 'Open']);
  });
});

function createImageCanvas(
  overrides: Partial<TransformedCanvas> = {}
): TransformedCanvas {
  return {
    id: 'https://example.com/canvas/1',
    type: 'Canvas',
    width: 100,
    height: 100,
    imageServiceId: 'https://example.com/image/1',
    label: 'Page 1',
    textServiceId: undefined,
    thumbnailImage: undefined,
    painting: [{ id: 'https://example.com/image/1', type: 'Image' }],
    original: [],
    rendering: [],
    supplementing: [],
    metadata: [],
    ...overrides,
  };
}

describe('hasNonImagesOrOriginals', () => {
  it('returns false when all canvases have only Image paintings and no originals', () => {
    const canvases = [
      createImageCanvas(),
      createImageCanvas({ id: 'https://example.com/canvas/2' }),
    ];
    expect(hasNonImagesOrOriginals(canvases)).toBe(false);
  });

  it('returns false for an empty canvases array', () => {
    expect(hasNonImagesOrOriginals([])).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(hasNonImagesOrOriginals(undefined)).toBe(false);
  });

  it('returns true when a canvas has a non-Image item in painting', () => {
    const canvases = [
      createImageCanvas({
        painting: [{ id: 'https://example.com/video/1', type: 'Video' }],
      }),
    ];
    expect(hasNonImagesOrOriginals(canvases)).toBe(true);
  });

  it('returns true when a canvas has a non-Image item in rendering', () => {
    const canvases = [
      createImageCanvas({
        rendering: [{ id: 'https://example.com/audio/1', type: 'Sound' }],
      }),
    ];
    expect(hasNonImagesOrOriginals(canvases)).toBe(true);
  });

  it('returns true when a canvas has a non-Image item in supplementing', () => {
    const canvases = [
      createImageCanvas({
        supplementing: [
          {
            id: 'https://example.com/doc.pdf',
            type: 'Text',
            format: 'application/pdf',
          },
        ],
      }),
    ];
    expect(hasNonImagesOrOriginals(canvases)).toBe(true);
  });

  it('returns true when any canvas has original files', () => {
    const canvases = [
      createImageCanvas(),
      createImageCanvas({
        id: 'https://example.com/canvas/2',
        original: [
          {
            id: 'https://example.com/file.pdf',
            type: 'Image',
            format: 'application/pdf',
            behavior: 'original' as const,
          },
        ],
      }),
    ];
    expect(hasNonImagesOrOriginals(canvases)).toBe(true);
  });

  it('returns false when all canvases are image-only even with empty arrays', () => {
    const canvases = [
      createImageCanvas({ rendering: [], supplementing: [], original: [] }),
    ];
    expect(hasNonImagesOrOriginals(canvases)).toBe(false);
  });

  it('returns true when only one of many canvases has a non-Image painting', () => {
    const canvases = [
      createImageCanvas(),
      createImageCanvas({ id: 'https://example.com/canvas/2' }),
      createImageCanvas({
        id: 'https://example.com/canvas/3',
        painting: [{ id: 'https://example.com/audio/1', type: 'Sound' }],
      }),
    ];
    expect(hasNonImagesOrOriginals(canvases)).toBe(true);
  });
});
