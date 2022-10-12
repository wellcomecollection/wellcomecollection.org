import { getCanvases, groupStructures } from '../../utils/iiif/v2';
import { getAudio } from '../../utils/iiif/v3';
import manifest from '@weco/common/__mocks__/iiif-manifest';
import {
  manifestWithAudioTitles,
  manifestWithTranscript,
} from '@weco/common/__mocks__/iiif-manifest-v3';

const canvases = getCanvases(manifest);
const structures = [
  {
    '@id':
      'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0001',
    '@type': 'sc:Range',
    label: 'First',
    canvases: [
      'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0001.jp2',
      'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0002.jp2',
    ],
  },
  {
    '@id':
      'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0002',
    '@type': 'sc:Range',
    label: 'First',
    canvases: [
      'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0003.jp2',
    ],
  },
  {
    '@id':
      'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0003',
    '@type': 'sc:Range',
    label: 'First',
    canvases: [
      'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0006.jp2',
    ],
  },
  {
    '@id':
      'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0004',
    '@type': 'sc:Range',
    label: 'Second',
    canvases: [
      'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0007.jp2',
    ],
  },
  {
    '@id':
      'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0005',
    '@type': 'sc:Range',
    label: 'Third',
    canvases: [
      'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0009.jp2',
    ],
  },
  {
    '@id':
      'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0006',
    '@type': 'sc:Range',
    label: 'Third',
    canvases: [
      'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0010.jp2',
    ],
  },
];

const correctResult = [
  {
    '@id':
      'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0001',
    '@type': 'sc:Range',
    label: 'First',
    canvases: [
      'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0001.jp2',
      'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0002.jp2',
      'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0003.jp2',
    ],
  },
  {
    '@id':
      'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0003',
    '@type': 'sc:Range',
    label: 'First',
    canvases: [
      'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0006.jp2',
    ],
  },
  {
    '@id':
      'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0004',
    '@type': 'sc:Range',
    label: 'Second',
    canvases: [
      'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0007.jp2',
    ],
  },
  {
    '@id':
      'https://iiif.wellcomecollection.org/presentation/b21538906/ranges/LOG_0005',
    '@type': 'sc:Range',
    label: 'Third',
    canvases: [
      'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0009.jp2',
      'https://iiif.wellcomecollection.org/presentation/b21538906/canvases/b21538906_0010.jp2',
    ],
  },
];

describe('Group repetitive iiif structures', () => {
  it('groups iiifStructures with consecutive canvases and the same label', () => {
    const groupedStructures = groupStructures(canvases, structures);
    expect(groupedStructures).toEqual(correctResult);
  });
});

describe('IIIF V3', () => {
  it('parses audio files and titles from a manifest', () => {
    const { sounds } = getAudio(manifestWithAudioTitles);
    expect(sounds.length).toBe(4);
    expect(sounds[0].sound.id).toBe(
      'https://iiif.wellcomecollection.org/av/b3250200x_0001.wav/full/max/default.mp3'
    );
    expect(sounds[0].title).toBe('Tape 1, Side 1');
    expect(sounds[3].title).toBe('Tape 2, Side 2');
  });

  it('parses an associated audio transcript from a manifest', () => {
    const { transcript } = getAudio(manifestWithTranscript);
    expect(transcript?.id).toBe(
      'https://iiif.wellcomecollection.org/file/b2248887x_0001.pdf'
    );
  });
});
