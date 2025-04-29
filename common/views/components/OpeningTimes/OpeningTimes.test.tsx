import { screen } from '@testing-library/react';

import * as serviceOpeningTimes from '@weco/common/services/prismic/opening-times';
import { shopVenue } from '@weco/common/test/fixtures/components/shop-venue';
import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';

import OpeningTimes from '.';

describe('OpeningTimes', () => {
  const spyOnGetTodaysVenueHours = jest.spyOn(
    serviceOpeningTimes,
    'getTodaysVenueHours'
  );

  // set Day as Wednesday, so we have something consistent to test against
  spyOnGetTodaysVenueHours.mockImplementation(() => {
    return {
      dayOfWeek: 'Wednesday',
      opens: '10:00',
      closes: '18:00',
      isClosed: false,
    };
  });

  it('Should not display any opening times if openingHours.regular and openingHours.exceptional are empty', () => {
    const mockOpeningTimes = [
      {
        id: 'WsuaIB8AAH-yNylo',
        order: 5,
        name: 'Shop',
        openingHours: {
          regular: [],
          exceptional: [],
        },
      },
    ];

    spyOnGetTodaysVenueHours.mockImplementation(() => {
      return undefined;
    });

    renderWithTheme(<OpeningTimes venues={mockOpeningTimes} />);
    expect(screen.getByRole('list'));
    expect(screen.getByRole('list').querySelectorAll('li').length).toBe(0);
    expect(() => screen.getByRole('listitem')).toThrow();
  });

  it('renders venue opening times as closed', () => {
    spyOnGetTodaysVenueHours.mockImplementation(() => {
      return {
        dayOfWeek: 'Monday',
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      };
    });
    renderWithTheme(<OpeningTimes venues={[shopVenue]} />);
    expect(screen.findByText('Shop'));
    expect(screen.findByText('closed'));
  });
});
