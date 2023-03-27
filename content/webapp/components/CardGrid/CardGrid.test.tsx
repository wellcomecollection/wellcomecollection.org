import CardGrid from './CardGrid';
import { MultiContent } from '../../types/multi-content';
import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { placeHolderImage } from '../../services/prismic/transformers/images';
import '@testing-library/jest-dom';

describe('CardGrid', () => {
  // This could be moved into fixture directory if used in more places
  const mockItems: MultiContent[] = [
    {
      start: new Date('2019-09-04T23:00:00.000Z'),
      end: new Date('2090-01-01T00:00:00.000Z'),
      id: 'XNFfsxAAANwqbNWD',
      title: 'Being Human',
      contributors: [],
      // body: [],
      // standfirst: undefined,
      promo: {
        image: placeHolderImage,
      },
      // image: {
      //   contentUrl:
      //     'https://images.prismic.io/wellcomecollection/0cfe014fb55e817bb3014c0c06cabf3a2fd5a74a_ep_000832_058.jpg?auto=compress,format',
      //   width: 4000,
      //   height: 2670,
      //   alt:
      //     'Photograph of an exhibition gallery space, with a blue stained wood ' +
      //     'wall in the background, in front of which a young man looks at a ' +
      //     'life-size artwork of a figure resembling an astronaut. In the ' +
      //     'foreground a young woman sits on a wooden bench holding an audio ' +
      //     'speaker to her ear.',
      //   crops: {},
      // },
      // squareImage: {
      //   contentUrl:
      //     'https://images.prismic.io/wellcomecollection/2e7bcd148d629cd8fe670d42bac997051f4112ea_ep_000832_058.jpg?auto=compress,format',
      //   width: 3200,
      //   height: 3200,
      //   alt:
      //     'Photograph of an exhibition gallery space, with a blue stained wood ' +
      //     'wall in the background, in front of which a young man looks at a ' +
      //     'life-size artwork of a figure resembling an astronaut. In the ' +
      //     'foreground a young woman sits on a wooden bench holding an audio ' +
      //     'speaker to her ear.',
      //   crops: {},
      // },
      // widescreenImage: {
      //   contentUrl:
      //     'https://images.prismic.io/wellcomecollection/b40da45c5b49cc5dd946dffeddbf8ce114ac0003_ep_000832_058.jpg?auto=compress,format',
      //   width: 3200,
      //   height: 1800,
      //   alt:
      //     'Photograph of an exhibition gallery space, with a blue stained wood ' +
      //     'wall in the background, in front of which a young man looks at a ' +
      //     'life-size artwork of a figure resembling an astronaut. In the ' +
      //     'foreground a young woman sits on a wooden bench holding an audio ' +
      //     'speaker to her ear.',
      //   crops: {},
      // },
      // metadataDescription: '',
      labels: [],
      type: 'exhibitions',
      // shortTitle: 'Being Human',
      format: {
        id: 'Wvw6wSAAAAuy63fP',
        title: 'Permanent',
      },
      isPermanent: true,
      statusOverride: 'Reopens 7 October',
      // place: {
      //   id: 'Wn1gdSoAACgAH_-x',
      //   title: 'Being Human gallery',
      //   body: [],
      //   labels: [],
      //   level: 1,
      //   information: [],
      // },
      // exhibits: [],
      // resources: [],
      // relatedIds: ['XYt51BAAACIAYa4e', 'XYofFREAACQAp-Vl'],
      // seasons: [],
    },
  ];

  describe('Links inside CardGrid', () => {
    it('renders multiple links within CardGrid component', () => {
      const mockLinks = [
        {
          text: 'View all exhibitions',
          url: '/exhibitions',
        },
        {
          text: 'View all events',
          url: '/events',
        },
      ];

      const { container, getByRole } = renderWithTheme(
        <CardGrid itemsPerRow={3} items={mockItems} links={mockLinks} />
      );

      expect(getByRole('link', { name: mockLinks[0].text })).toHaveAttribute(
        'href',
        mockLinks[0].url
      );
      expect(getByRole('link', { name: mockLinks[1].text })).toHaveAttribute(
        'href',
        mockLinks[1].url
      );
    });
  });
});
