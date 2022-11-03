import { Manifest, Range } from '@iiif/presentation-3';
import {
  getAudio,
  getTransformedCanvases,
  getMultiVolumeLabel,
} from '../../utils/iiif/v3';
import { groupStructures } from '../../utils/iiif/v2';
import {
  manifest,
  manifestWithAudioTitles,
  manifestWithTranscript,
} from '@weco/common/__mocks__/iiif-manifest-v3';

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

describe('Group repetitive iiif structures', () => {
  it('groups iiifStructures with consecutive canvases and the same label', () => {
    const groupedStructures = groupStructures(
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

describe('IIIF V3', () => {
  it('parses audio files and titles from a manifest', () => {
    const { sounds } = getAudio(manifestWithAudioTitles as Manifest);
    expect(sounds.length).toBe(4);
    expect(sounds[0].sound.id).toBe(
      'https://iiif.wellcomecollection.org/av/b3250200x_0001.wav/full/max/default.mp3'
    );
    expect(sounds[0].title).toBe('Tape 1, Side 1');
    expect(sounds[3].title).toBe('Tape 2, Side 2');
  });

  it('parses an associated audio transcript from a manifest', () => {
    const { transcript } = getAudio(manifestWithTranscript as Manifest);
    expect(transcript?.id).toBe(
      'https://iiif.wellcomecollection.org/file/b2248887x_0001.pdf'
    );
  });
});
