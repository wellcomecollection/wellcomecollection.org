import { getCanvases, groupStructures } from '../../utils/iiif';
import manifest from '../../../common/__mocks__/iiif-manifest';

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
