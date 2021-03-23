import { getCanvases, groupStructures } from '../../utils/iiif';
import manifest from '../../../common/__mocks__/iiif-manifest';

const canvases = getCanvases(manifest);
const structures = [
  {
    '@id': 'https://wellcomelibrary.org/iiif/b21538906/range/r-0',
    '@type': 'sc:Range',
    label: 'First',
    canvases: [
      'https://wellcomelibrary.org/iiif/b21538906/canvas/c0',
      'https://wellcomelibrary.org/iiif/b21538906/canvas/c1',
    ],
  },
  {
    '@id': 'https://wellcomelibrary.org/iiif/b21538906/range/r-1',
    '@type': 'sc:Range',
    label: 'First',
    canvases: ['https://wellcomelibrary.org/iiif/b21538906/canvas/c2'],
  },
  {
    '@id': 'https://wellcomelibrary.org/iiif/b21538906/range/r-2',
    '@type': 'sc:Range',
    label: 'First',
    canvases: ['https://wellcomelibrary.org/iiif/b21538906/canvas/c5'],
  },
  {
    '@id': 'https://wellcomelibrary.org/iiif/b21538906/range/r-3',
    '@type': 'sc:Range',
    label: 'Second',
    canvases: ['https://wellcomelibrary.org/iiif/b21538906/canvas/c6'],
  },
  {
    '@id': 'https://wellcomelibrary.org/iiif/b21538906/range/r-4',
    '@type': 'sc:Range',
    label: 'Third',
    canvases: ['https://wellcomelibrary.org/iiif/b21538906/canvas/c8'],
  },
  {
    '@id': 'https://wellcomelibrary.org/iiif/b21538906/range/r-5',
    '@type': 'sc:Range',
    label: 'Third',
    canvases: ['https://wellcomelibrary.org/iiif/b21538906/canvas/c9'],
  },
];

const correctResult = [
  {
    '@id': 'https://wellcomelibrary.org/iiif/b21538906/range/r-0',
    '@type': 'sc:Range',
    label: 'First',
    canvases: [
      'https://wellcomelibrary.org/iiif/b21538906/canvas/c0',
      'https://wellcomelibrary.org/iiif/b21538906/canvas/c1',
      'https://wellcomelibrary.org/iiif/b21538906/canvas/c2',
    ],
  },
  {
    '@id': 'https://wellcomelibrary.org/iiif/b21538906/range/r-2',
    '@type': 'sc:Range',
    label: 'First',
    canvases: ['https://wellcomelibrary.org/iiif/b21538906/canvas/c5'],
  },
  {
    '@id': 'https://wellcomelibrary.org/iiif/b21538906/range/r-3',
    '@type': 'sc:Range',
    label: 'Second',
    canvases: ['https://wellcomelibrary.org/iiif/b21538906/canvas/c6'],
  },
  {
    '@id': 'https://wellcomelibrary.org/iiif/b21538906/range/r-4',
    '@type': 'sc:Range',
    label: 'Third',
    canvases: [
      'https://wellcomelibrary.org/iiif/b21538906/canvas/c8',
      'https://wellcomelibrary.org/iiif/b21538906/canvas/c9',
    ],
  },
];
describe('Group repetitive iiif structures', () => {
  it('groups iiifStructures with consecutive canvases and the same label', () => {
    const groupedStructures = groupStructures(canvases, structures);
    expect(groupedStructures).toEqual(correctResult);
  });
});
