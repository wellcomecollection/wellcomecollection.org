import { Manifest, Range } from '@iiif/presentation-3';

import {
  manifest,
  manifestMixedStandardAndNonStandard,
  manifestNoStandard,
  manifestWithTranscript,
  physicalDescriptionMetadataItem,
} from '@weco/content/__mocks__/iiif-manifest-v3';
import {
  getIIIFMetadata,
  getIIIFPresentationCredit,
  getItemsStatus,
  getMultiVolumeLabel,
  getTransformedCanvases,
  groupRanges,
  isPDFCanvas,
} from '@weco/content/utils/iiif/v3';

const canvases = getTransformedCanvases(manifest as Manifest);
const structures = [
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0001',
    type: 'Range',
    label: {
      en: ['First'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0001.jp2',
      },
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0002.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0002',
    type: 'Range',
    label: {
      en: ['First'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0003.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0003',
    type: 'Range',
    label: {
      en: ['First'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0006.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0004',
    type: 'Range',
    label: {
      en: ['Second'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0007.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0005',
    type: 'Range',
    label: {
      en: ['Third'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0009.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0006',
    type: 'Range',
    label: {
      en: ['Third'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0010.jp2',
      },
    ],
  },
];

const correctResult = [
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0001',
    type: 'Range',
    label: {
      en: ['First'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0001.jp2',
      },
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0002.jp2',
      },
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0003.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0003',
    type: 'Range',
    label: {
      en: ['First'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0006.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0004',
    type: 'Range',
    label: {
      en: ['Second'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0007.jp2',
      },
    ],
  },
  {
    id: 'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0005',
    type: 'Range',
    label: {
      en: ['Third'],
    },
    items: [
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0009.jp2',
      },
      {
        id: 'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0010.jp2',
      },
    ],
  },
];

describe('Group repetitive iiif ranges', () => {
  it('groups iiif ranges with consecutive canvases and the same label', () => {
    const groupedStructures = groupRanges(
      canvases,
      structures as unknown as Range[]
    );

    expect(groupedStructures).toEqual(correctResult);
  });
});

describe('getMultiVolumeLabel', () => {
  it('returns the appropriate label from an array', () => {
    const label1 = getMultiVolumeLabel(
      { en: ['Practica seu Lilium medicinae', 'Copy 1'] },
      'Practica seu Lilium medicinae'
    );
    const label2 = getMultiVolumeLabel(
      { en: ['Volume 1', 'The diary of Samuel Pepys'] },
      'The diary of Samuel Pepys'
    );

    expect(label1).toEqual('Copy 1');
    expect(label2).toEqual('Volume 1');
  });
});

describe('getIIIFMetadata', () => {
  it('returns the correct MetadataItem from a manifest', () => {
    const metadataItem = getIIIFMetadata(
      manifestWithTranscript as Manifest,
      'Physical description'
    );
    expect(physicalDescriptionMetadataItem).toEqual(metadataItem);
  });
});

describe('getIIIFPresentationCredit', () => {
  it('returns the relevant attribution and usage information', () => {
    const credit = getIIIFPresentationCredit(
      manifestWithTranscript as Manifest
    );
    expect(credit).toEqual('Wellcome Collection');
  });
});

describe('Determines if a iiif-manifest includes non standard items', () => {
  it('returns a status of "allStandard" for manifests with only standard items', () => {
    const itemsStatus = getItemsStatus(manifest as Manifest);
    expect(itemsStatus).toEqual('allStandard');
  });
  it('returns a status of "mixedStandardAndNonStandard" for manifests with a mix of standard and non standard items', () => {
    const itemsStatus = getItemsStatus(
      manifestMixedStandardAndNonStandard as unknown as Manifest
    );
    expect(itemsStatus).toEqual('mixedStandardAndNonStandard');
  });
  it('returns a status of "noStandard" for manifests with only non standard items', () => {
    const itemsStatus = getItemsStatus(
      manifestNoStandard as unknown as Manifest
    );
    expect(itemsStatus).toEqual('noStandard');
  });
});

describe('isPDFCanvas', () => {
  const createMockCanvas = (overrides = {}) => ({
    id: 'test-canvas',
    type: 'Canvas' as const,
    width: 100,
    height: 100,
    imageServiceId: undefined,
    hasRestrictedImage: false,
    label: 'Test Canvas',
    textServiceId: undefined,
    thumbnailImage: undefined,
    painting: [],
    original: [],
    supplementing: [],
    metadata: [],
    ...overrides,
  });

  it('returns false for undefined canvas', () => {
    expect(isPDFCanvas(undefined)).toBe(false);
  });

  it('returns false for canvas with no PDF content', () => {
    const canvas = createMockCanvas();
    expect(isPDFCanvas(canvas)).toBe(false);
  });

  it('returns true for born digital PDF with application/pdf in original', () => {
    const canvas = createMockCanvas({
      original: [
        {
          id: 'test-pdf',
          type: 'Image',
          format: 'application/pdf',
          label: 'PDF',
        },
      ],
    });
    expect(isPDFCanvas(canvas)).toBe(true);
  });

  it('returns true for PDF supplement with no paintings', () => {
    const canvas = createMockCanvas({
      supplementing: [
        {
          id: 'test-supplement',
          type: 'Text',
          format: 'application/pdf',
        },
      ],
      painting: [],
    });
    expect(isPDFCanvas(canvas)).toBe(true);
  });

  it('returns false for PDF supplement with paintings (e.g., video with PDF transcript)', () => {
    const canvas = createMockCanvas({
      supplementing: [
        {
          id: 'test-supplement',
          type: 'Text',
          format: 'application/pdf',
        },
      ],
      painting: [
        {
          id: 'test-video',
          type: 'Video',
          format: 'video/mp4',
        },
      ],
    });
    expect(isPDFCanvas(canvas)).toBe(false);
  });

  it('returns true for PDF supplement with ChoiceBody containing PDF', () => {
    const canvas = createMockCanvas({
      supplementing: [
        {
          type: 'Choice',
          items: [
            {
              id: 'test-choice-pdf',
              type: 'Text',
              format: 'application/pdf',
            },
          ],
        },
      ],
      painting: [],
    });
    expect(isPDFCanvas(canvas)).toBe(true);
  });

  it('returns false for ChoiceBody with string items', () => {
    const canvas = createMockCanvas({
      supplementing: [
        {
          type: 'Choice',
          items: ['string-item'],
        },
      ],
      painting: [],
    });
    expect(isPDFCanvas(canvas)).toBe(false);
  });

  it('returns false for ChoiceBody with non-PDF items', () => {
    const canvas = createMockCanvas({
      supplementing: [
        {
          type: 'Choice',
          items: [
            {
              id: 'test-choice-image',
              type: 'Image',
              format: 'image/jpeg',
            },
          ],
        },
      ],
      painting: [],
    });
    expect(isPDFCanvas(canvas)).toBe(false);
  });

  it('returns true for born digital PDF even with paintings', () => {
    const canvas = createMockCanvas({
      original: [
        {
          id: 'test-pdf',
          type: 'Image',
          format: 'application/pdf',
          label: 'PDF',
        },
      ],
      painting: [
        {
          id: 'test-image',
          type: 'Image',
          format: 'image/jpeg',
        },
      ],
    });
    expect(isPDFCanvas(canvas)).toBe(true);
  });

  it('returns false for supplement without format property', () => {
    const canvas = createMockCanvas({
      supplementing: [
        {
          id: 'test-supplement',
          type: 'Text',
        },
      ],
      painting: [],
    });
    expect(isPDFCanvas(canvas)).toBe(false);
  });
});
