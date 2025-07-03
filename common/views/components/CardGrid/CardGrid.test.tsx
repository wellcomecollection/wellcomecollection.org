import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { placeHolderImage } from '@weco/content/services/prismic/transformers/images';
import { MultiContent } from '@weco/content/types/multi-content';

import CardGrid from '.';
import '@testing-library/jest-dom';

describe('CardGrid', () => {
  // This could be moved into fixture directory if used in more places
  const mockItems: MultiContent[] = [
    {
      start: new Date('2019-09-04T23:00:00.000Z'),
      end: new Date('2090-01-01T00:00:00.000Z'),
      id: 'XNFfsxAAANwqbNWD',
      uid: 'being-human',
      title: 'Being Human',
      contributors: [],
      promo: {
        image: placeHolderImage,
      },
      labels: [],
      type: 'exhibitions',
      format: {
        id: 'Wvw6wSAAAAuy63fP',
        title: 'Permanent',
      },
      isPermanent: true,
      statusOverride: 'Reopens 7 October',
    },
  ];

  describe('Links inside CardGrid', () => {
    it('renders multiple links within CardGrid component', async () => {
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

      const { getByRole } = renderWithTheme(
        <CardGrid itemsPerRow={3} items={mockItems} links={mockLinks} />
      );

      await expect(
        getByRole('link', { name: mockLinks[0].text })
      ).toHaveAttribute('href', mockLinks[0].url);
      await expect(
        getByRole('link', { name: mockLinks[1].text })
      ).toHaveAttribute('href', mockLinks[1].url);
    });
  });
});
