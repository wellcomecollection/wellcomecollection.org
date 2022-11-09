import OpeningTimes from './OpeningTimes';
import {
  shallowWithTheme,
  mountWithTheme,
} from '../../../test/fixtures/enzyme-helpers';
import { venues } from '../../../test/fixtures/components/venues';
import * as serviceOpeningTimes from '@weco/common/services/prismic/opening-times';
import { shopVenue } from '../../../test/fixtures/components/shop-venue';

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

    const component = mountWithTheme(
      <OpeningTimes venues={mockOpeningTimes} />
    );

    const openingTimes = component.find('ul');
    expect(openingTimes.length).toEqual(1);
    expect(openingTimes.find('li').length).toEqual(0);
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
    const component = shallowWithTheme(<OpeningTimes venues={[shopVenue]} />);
    expect(component.html().includes('Shop')).toBeTruthy();
    expect(component.html().includes('closed')).toBeTruthy();
  });
});
