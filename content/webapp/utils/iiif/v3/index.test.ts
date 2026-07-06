import { Canvas, Manifest } from '@iiif/presentation-3';

import type {
  Auth,
  ManifestAccessRequirement,
  ServiceWithMetadata,
  TransformedCanvas,
} from '@weco/content/types/manifest';

import {
  checkModalRequired,
  deduplicateDownloadOptions,
  getDownloadOptionsFromCanvasRenderingAndSupplementing,
  getDownloadOptionsFromManifestRendering,
  getFileSize,
  getFileTypeLabel,
  getImageServiceFromItem,
  getItemsStatus,
  getManifestAccessRequirements,
  getOriginalFiles,
  getProbeServiceId,
  getVideoAudioDownloadOptions,
  hasItemType,
  hasNonImagesOrOriginals,
  hasOriginalPdf,
  hasRestrictedItem,
  isAudioCanvas,
  isChoiceBody,
  isCollection,
  isItemRestricted,
  isPDFCanvas,
  transformCanvas,
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

describe('deduplicateDownloadOptions', () => {
  it('returns an empty array when given an empty array', () => {
    expect(deduplicateDownloadOptions([])).toEqual([]);
  });

  it('returns the same options when there are no duplicates', () => {
    const options = [
      { id: 'a', label: 'File A', format: 'application/pdf' },
      { id: 'b', label: 'File B', format: 'video/mp4' },
    ];
    expect(deduplicateDownloadOptions(options)).toEqual(options);
  });

  it('removes later duplicates and preserves the first occurrence', () => {
    const first = { id: 'a', label: 'First', format: 'application/pdf' };
    const duplicate = {
      id: 'a',
      label: 'Duplicate',
      format: 'application/pdf',
    };
    const other = { id: 'b', label: 'Other', format: 'video/mp4' };
    expect(deduplicateDownloadOptions([first, duplicate, other])).toEqual([
      first,
      other,
    ]);
  });

  it('handles all duplicates', () => {
    const option = { id: 'x', label: 'X', format: 'text/plain' };
    expect(deduplicateDownloadOptions([option, option, option])).toEqual([
      option,
    ]);
  });
});

// A painting item carrying the restricted-login access service. This is the
// shape the viewer inspects to decide whether the current canvas is restricted.
const restrictedLoginId =
  'https://iiif.wellcomecollection.org/auth/v2/access/restrictedlogin';

function restrictedPainting(
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

function openPainting(
  overrides: Record<string, unknown> = {}
): TransformedCanvas['painting'][number] {
  return {
    id: 'https://example.com/image/open',
    type: 'Image',
    ...overrides,
  } as unknown as TransformedCanvas['painting'][number];
}

describe('isChoiceBody', () => {
  it('is true for a Choice item', () => {
    expect(isChoiceBody({ id: 'c', type: 'Choice', items: [] } as never)).toBe(
      true
    );
  });

  it('is false for a non-Choice content resource', () => {
    expect(isChoiceBody({ id: 'i', type: 'Image' } as never)).toBe(false);
  });

  it('is false for a string or undefined', () => {
    expect(isChoiceBody('some-string' as never)).toBe(false);
    expect(isChoiceBody(undefined)).toBe(false);
  });
});

describe('isItemRestricted', () => {
  it('is true when a painting has the restricted-login access service', () => {
    expect(isItemRestricted(restrictedPainting())).toBe(true);
  });

  it('is false when a painting has no service', () => {
    expect(isItemRestricted(openPainting())).toBe(false);
  });

  it('is false when the access service is not restricted-login', () => {
    const painting = openPainting({
      service: [
        {
          id: 'https://example.com/probe',
          type: 'AuthProbeService2',
          service: [
            {
              id: 'https://iiif.wellcomecollection.org/auth/v2/access/clickthrough',
              type: 'AuthAccessService2',
            },
          ],
        },
      ],
    });
    expect(isItemRestricted(painting)).toBe(false);
  });

  it('is false for a Choice body', () => {
    expect(isItemRestricted({ type: 'Choice', items: [] } as never)).toBe(
      false
    );
  });
});

describe('hasRestrictedItem', () => {
  it('is true when a painting item is restricted', () => {
    const canvas = createImageCanvas({ painting: [restrictedPainting()] });
    expect(hasRestrictedItem(canvas)).toBe(true);
  });

  it('is true when a supplementing item is restricted', () => {
    const canvas = createImageCanvas({
      painting: [openPainting()],
      supplementing: [restrictedPainting()],
    });
    expect(hasRestrictedItem(canvas)).toBe(true);
  });

  it('is true when an original item is restricted', () => {
    const canvas = createImageCanvas({
      painting: [openPainting()],
      original: [restrictedPainting() as never],
    });
    expect(hasRestrictedItem(canvas)).toBe(true);
  });

  it('is false when nothing is restricted', () => {
    const canvas = createImageCanvas({ painting: [openPainting()] });
    expect(hasRestrictedItem(canvas)).toBe(false);
  });

  it('is false for a canvas with empty item arrays', () => {
    const canvas = createImageCanvas({
      painting: [],
      supplementing: [],
      original: [],
    });
    expect(hasRestrictedItem(canvas)).toBe(false);
  });
});

describe('getProbeServiceId', () => {
  it('returns the AuthProbeService2 id when present', () => {
    expect(getProbeServiceId(restrictedPainting())).toBe(
      'https://example.com/probe'
    );
  });

  it('returns undefined when the painting has no service', () => {
    expect(getProbeServiceId(openPainting())).toBeUndefined();
  });

  it('returns undefined for a Choice body', () => {
    expect(
      getProbeServiceId({ type: 'Choice', items: [] } as never)
    ).toBeUndefined();
  });
});

describe('checkModalRequired', () => {
  const authWith = (accessRequirements: ManifestAccessRequirement[]): Auth => ({
    externalAccessService: undefined,
    activeAccessService: undefined,
    tokenService: undefined,
    accessRequirements,
  });

  it('is false when there are no access requirements', () => {
    expect(checkModalRequired({ userIsStaffWithRestricted: false })).toBe(
      false
    );
    expect(
      checkModalRequired({
        userIsStaffWithRestricted: false,
        auth: authWith([]),
      })
    ).toBe(false);
  });

  it('always requires a modal for "Open with advisory"', () => {
    expect(
      checkModalRequired({
        userIsStaffWithRestricted: true,
        auth: authWith(['Open with advisory']),
      })
    ).toBe(true);
  });

  it('requires a modal for "Restricted files" unless the user is staff', () => {
    const auth = authWith(['Restricted files']);
    expect(checkModalRequired({ userIsStaffWithRestricted: false, auth })).toBe(
      true
    );
    expect(checkModalRequired({ userIsStaffWithRestricted: true, auth })).toBe(
      false
    );
  });

  it('does not require a modal when "Restricted files" also has "Open"', () => {
    expect(
      checkModalRequired({
        userIsStaffWithRestricted: false,
        auth: authWith(['Restricted files', 'Open']),
      })
    ).toBe(false);
  });

  it('does not require a modal for open content', () => {
    expect(
      checkModalRequired({
        userIsStaffWithRestricted: false,
        auth: authWith(['Open']),
      })
    ).toBe(false);
  });
});

describe('getDownloadOptionsFromManifestRendering', () => {
  it('maps renderings to download options', () => {
    const rendering = [
      {
        id: 'https://example.com/whole.pdf',
        format: 'application/pdf',
        label: { en: ['Whole item'] },
      },
    ];
    expect(getDownloadOptionsFromManifestRendering(rendering as never)).toEqual(
      [
        {
          id: 'https://example.com/whole.pdf',
          label: 'Whole item',
          format: 'application/pdf',
        },
      ]
    );
  });

  it('excludes application/zip and text/plain renderings', () => {
    const rendering = [
      { id: 'a', format: 'application/zip', label: { en: ['Zip'] } },
      { id: 'b', format: 'text/plain', label: { en: ['Text'] } },
      { id: 'c', format: 'application/pdf', label: { en: ['PDF'] } },
    ];
    const result = getDownloadOptionsFromManifestRendering(rendering as never);
    expect(result.map(o => o.id)).toEqual(['c']);
  });

  it('excludes renderings without an id', () => {
    const rendering = [{ format: 'application/pdf', label: { en: ['PDF'] } }];
    expect(getDownloadOptionsFromManifestRendering(rendering as never)).toEqual(
      []
    );
  });

  it('falls back to a default label when none is present', () => {
    const rendering = [{ id: 'a', format: 'application/pdf' }];
    expect(
      getDownloadOptionsFromManifestRendering(rendering as never)[0].label
    ).toBe('Download file');
  });

  it('returns an empty array for undefined rendering', () => {
    expect(getDownloadOptionsFromManifestRendering(undefined)).toEqual([]);
  });
});

describe('getDownloadOptionsFromCanvasRenderingAndSupplementing', () => {
  it('combines rendering and supplementing into download options', () => {
    const canvas = createImageCanvas({
      rendering: [
        {
          id: 'https://example.com/r.pdf',
          type: 'Text',
          format: 'application/pdf',
          label: { en: ['Rendering'] },
        },
      ] as never,
      supplementing: [
        {
          id: 'https://example.com/s.vtt',
          type: 'Text',
          format: 'text/vtt',
          label: { en: ['Transcript'] },
        },
      ] as never,
    });
    const result =
      getDownloadOptionsFromCanvasRenderingAndSupplementing(canvas);
    expect(result.map(o => o.id)).toEqual([
      'https://example.com/r.pdf',
      'https://example.com/s.vtt',
    ]);
  });

  it('flattens Choice bodies and drops string items', () => {
    const canvas = createImageCanvas({
      rendering: [
        {
          type: 'Choice',
          items: [
            {
              id: 'https://example.com/choice.pdf',
              type: 'Text',
              format: 'application/pdf',
            },
          ],
        },
      ] as never,
      supplementing: [],
    });
    const result =
      getDownloadOptionsFromCanvasRenderingAndSupplementing(canvas);
    expect(result.map(o => o.id)).toEqual(['https://example.com/choice.pdf']);
  });
});

describe('getVideoAudioDownloadOptions', () => {
  it('labels a video download "This video"', () => {
    const canvas = createImageCanvas({
      painting: [{ id: 'v1', type: 'Video', format: 'video/mp4' }] as never,
    });
    expect(getVideoAudioDownloadOptions(canvas)).toEqual([
      { id: 'v1', format: 'video/mp4', label: 'This video' },
    ]);
  });

  it('labels an audio download "This audio"', () => {
    const canvas = createImageCanvas({
      painting: [{ id: 'a1', type: 'Sound', format: 'audio/mp3' }] as never,
    });
    expect(getVideoAudioDownloadOptions(canvas)).toEqual([
      { id: 'a1', format: 'audio/mp3', label: 'This audio' },
    ]);
  });

  it('reads video/audio items from a Choice body', () => {
    const canvas = createImageCanvas({
      painting: [
        {
          type: 'Choice',
          items: [{ id: 'v1', type: 'Video', format: 'video/mp4' }],
        },
      ] as never,
    });
    expect(getVideoAudioDownloadOptions(canvas)).toEqual([
      { id: 'v1', format: 'video/mp4', label: 'This video' },
    ]);
  });

  it('ignores non video/audio paintings', () => {
    const canvas = createImageCanvas({
      painting: [{ id: 'i1', type: 'Image' }] as never,
    });
    expect(getVideoAudioDownloadOptions(canvas)).toEqual([]);
  });

  it('returns an empty array for an undefined canvas', () => {
    expect(getVideoAudioDownloadOptions(undefined)).toEqual([]);
  });
});

describe('hasItemType', () => {
  it('detects a matching painting type', () => {
    const canvases = [
      createImageCanvas({ painting: [{ id: 'v', type: 'Video' }] as never }),
    ];
    expect(hasItemType(canvases, 'Video')).toBe(true);
    expect(hasItemType(canvases, 'Sound')).toBe(false);
  });

  it('detects a type nested inside a Choice body', () => {
    const canvases = [
      createImageCanvas({
        painting: [
          { type: 'Choice', items: [{ id: 'a', type: 'Sound' }] },
        ] as never,
      }),
    ];
    expect(hasItemType(canvases, 'Sound')).toBe(true);
  });

  it('is false for undefined canvases', () => {
    expect(hasItemType(undefined, 'Image')).toBe(false);
  });
});

describe('hasOriginalPdf', () => {
  it('is true when an original file is a PDF', () => {
    const canvases = [
      createImageCanvas({
        original: [
          { id: 'o', format: 'application/pdf', behavior: 'original' },
        ] as never,
      }),
    ];
    expect(hasOriginalPdf(canvases)).toBe(true);
  });

  it('is false when there are no original PDFs', () => {
    expect(hasOriginalPdf([createImageCanvas()])).toBe(false);
    expect(hasOriginalPdf(undefined)).toBe(false);
  });
});

describe('isPDFCanvas', () => {
  it('is true for a born-digital PDF (original file)', () => {
    const canvas = createImageCanvas({
      original: [
        { id: 'o', format: 'application/pdf', behavior: 'original' },
      ] as never,
    });
    expect(isPDFCanvas(canvas)).toBe(true);
  });

  it('is true for a PDF supplement when there are no paintings', () => {
    const canvas = createImageCanvas({
      painting: [],
      supplementing: [
        { id: 's', type: 'Text', format: 'application/pdf' },
      ] as never,
    });
    expect(isPDFCanvas(canvas)).toBe(true);
  });

  it('is false for a PDF supplement when paintings are present (e.g. a video)', () => {
    const canvas = createImageCanvas({
      painting: [{ id: 'v', type: 'Video' }] as never,
      supplementing: [
        { id: 's', type: 'Text', format: 'application/pdf' },
      ] as never,
    });
    expect(isPDFCanvas(canvas)).toBe(false);
  });

  it('is false for undefined', () => {
    expect(isPDFCanvas(undefined)).toBe(false);
  });
});

describe('isAudioCanvas', () => {
  it('is true for Sound and Audio types', () => {
    expect(isAudioCanvas(createImageCanvas({ type: 'Sound' as never }))).toBe(
      true
    );
    expect(isAudioCanvas(createImageCanvas({ type: 'Audio' as never }))).toBe(
      true
    );
  });

  it('is false for an Image and undefined', () => {
    expect(isAudioCanvas(createImageCanvas({ type: 'Image' as never }))).toBe(
      false
    );
    expect(isAudioCanvas(undefined)).toBe(false);
  });
});

describe('getItemsStatus', () => {
  const canvasWith = (behavior?: string[]) =>
    ({ id: 'c', type: 'Canvas', behavior }) as unknown as Canvas;

  it('is "allStandard" when no items are placeholders', () => {
    const manifest = createTestManifest({
      items: [canvasWith(), canvasWith([])],
    });
    expect(getItemsStatus(manifest)).toBe('allStandard');
  });

  it('is "noStandard" when every item is a placeholder', () => {
    const manifest = createTestManifest({
      items: [canvasWith(['placeholder'])],
    });
    expect(getItemsStatus(manifest)).toBe('noStandard');
  });

  it('is "mixedStandardAndNonStandard" for a mix', () => {
    const manifest = createTestManifest({
      items: [canvasWith(['placeholder']), canvasWith()],
    });
    expect(getItemsStatus(manifest)).toBe('mixedStandardAndNonStandard');
  });
});

describe('getFileTypeLabel', () => {
  const imageCanvas = createImageCanvas();
  const videoCanvas = createImageCanvas({
    painting: [{ id: 'v', type: 'Video' }] as never,
  });
  const audioCanvas = createImageCanvas({
    painting: [{ id: 'a', type: 'Sound' }] as never,
  });
  const pdfCanvas = createImageCanvas({
    original: [
      { id: 'o', format: 'application/pdf', behavior: 'original' },
    ] as never,
  });

  it('prefers a volumes label for multi-manifest collections', () => {
    expect(getFileTypeLabel(3, 10, false, [imageCanvas])).toBe('3 volumes');
  });

  it('labels a set of all-PDF canvases', () => {
    expect(getFileTypeLabel(0, 1, false, [pdfCanvas])).toBe('1 PDF file');
  });

  it('labels non-standard items as generic files', () => {
    expect(getFileTypeLabel(0, 2, true, [imageCanvas])).toBe('2 files');
  });

  it('labels mixed standard content as generic files', () => {
    expect(getFileTypeLabel(0, 2, false, [videoCanvas, imageCanvas])).toBe(
      '2 files'
    );
  });

  it('labels a single specific type', () => {
    expect(getFileTypeLabel(0, 2, false, [imageCanvas])).toBe('2 images');
    expect(getFileTypeLabel(0, 1, false, [videoCanvas])).toBe('1 video file');
    expect(getFileTypeLabel(0, 1, false, [audioCanvas])).toBe('1 audio file');
  });

  it('labels an empty canvas array as PDF files (vacuous every() quirk)', () => {
    // With no canvases, `canvases.every(isPDFCanvas)` is vacuously true, so the
    // all-PDFs branch is taken. Documenting current behaviour, not endorsing it.
    expect(getFileTypeLabel(0, 0, false, [])).toBe('0 PDF files');
  });

  it('defaults to images when canvases is undefined', () => {
    expect(getFileTypeLabel(0, 0, false, undefined)).toBe('0 images');
  });
});

describe('getImageServiceFromItem', () => {
  it('returns the ImageService2 service from an item', () => {
    const item = {
      id: 'i',
      type: 'Image',
      service: [
        { '@id': 'https://example.com/iiif/image', '@type': 'ImageService2' },
      ],
    };
    expect(getImageServiceFromItem(item as never)?.['@id']).toBe(
      'https://example.com/iiif/image'
    );
  });

  it('returns undefined when the item has no service', () => {
    expect(getImageServiceFromItem({ id: 'i', type: 'Image' } as never)).toBe(
      undefined
    );
  });
});

describe('getFileSize', () => {
  it('reads the "File size" metadata value', () => {
    const canvas = createImageCanvas({
      metadata: [{ label: { en: ['File size'] }, value: { none: ['1.2 MB'] } }],
    });
    expect(getFileSize(canvas)).toBe('1.2 MB');
  });

  it('returns undefined when there is no file size metadata', () => {
    expect(getFileSize(createImageCanvas({ metadata: [] }))).toBeUndefined();
  });
});

describe('getOriginalFiles', () => {
  it('prefers original over rendering, painting and supplementing', () => {
    const canvas = createImageCanvas({
      original: [{ id: 'original', behavior: 'original' }] as never,
      rendering: [{ id: 'rendering', type: 'Text' }] as never,
      painting: [{ id: 'painting', type: 'Image' }] as never,
      supplementing: [{ id: 'supplementing', type: 'Text' }] as never,
    });
    expect(getOriginalFiles(canvas).map(f => f.id)).toEqual(['original']);
  });

  it('falls back to rendering, then painting, then supplementing', () => {
    expect(
      getOriginalFiles(
        createImageCanvas({
          original: [],
          rendering: [{ id: 'rendering', type: 'Text' }] as never,
        })
      ).map(f => f.id)
    ).toEqual(['rendering']);

    expect(
      getOriginalFiles(
        createImageCanvas({
          original: [],
          rendering: [],
          painting: [{ id: 'painting', type: 'Image' }] as never,
        })
      ).map(f => f.id)
    ).toEqual(['painting']);

    expect(
      getOriginalFiles(
        createImageCanvas({
          original: [],
          rendering: [],
          painting: [],
          supplementing: [{ id: 'supplementing', type: 'Text' }] as never,
        })
      ).map(f => f.id)
    ).toEqual(['supplementing']);
  });
});

describe('isCollection', () => {
  it('is true for a Collection and false for a Manifest', () => {
    expect(
      isCollection(createTestManifest({ type: 'Collection' } as never))
    ).toBe(true);
    expect(isCollection(createTestManifest())).toBe(false);
  });
});

describe('transformCanvas', () => {
  it('derives the key fields the viewer relies on from a raw canvas', () => {
    const rawCanvas = {
      id: 'https://example.com/canvas/1',
      type: 'Canvas',
      width: 100,
      height: 200,
      label: { en: ['Page 1'] },
      items: [
        {
          id: 'https://example.com/canvas/1/page',
          type: 'AnnotationPage',
          items: [
            {
              id: 'https://example.com/canvas/1/annotation',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                id: 'https://example.com/image',
                type: 'Image',
                service: [
                  {
                    '@id': 'https://example.com/iiif/image',
                    '@type': 'ImageService2',
                  },
                ],
              },
            },
          ],
        },
      ],
    } as unknown as Canvas;

    const transformed = transformCanvas(rawCanvas);

    expect(transformed).toMatchObject({
      id: 'https://example.com/canvas/1',
      type: 'Canvas',
      width: 100,
      height: 200,
      label: 'Page 1',
      imageServiceId: 'https://example.com/iiif/image',
      probeServiceId: undefined,
    });
    expect(transformed.painting).toHaveLength(1);
  });
});
