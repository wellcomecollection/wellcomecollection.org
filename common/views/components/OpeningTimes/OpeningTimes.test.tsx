import OpeningTimes from './OpeningTimes';
import {
  shallowWithTheme,
  mountWithTheme,
} from '../../../test/fixtures/enzyme-helpers';
import { openingTimes } from '../../../test/fixtures/components/opening-times';
import * as serviceOpeningTimes from '@weco/common/services/prismic/opening-times';

describe('OpeningTimes', () => {
  const spyOnGetTodaysVenueHours = jest.spyOn(
    serviceOpeningTimes,
    'getTodaysVenueHours'
  );

  it('Should display opening times name restaurant as Kitchen', () => {
    const component = shallowWithTheme(
      <OpeningTimes openingTimes={openingTimes} />
    );

    expect(component.html().match('Kitchen '));
  });

  it('Should not display render any opening times if opening times are empty', () => {
    const mockOpeningTimes = {
      placesOpeningHours: [
        {
          id: 'WsuaIB8AAH-yNylo',
          order: 5,
          name: 'Shop',
          openingHours: {
            regular: [],
            exceptional: [],
          },
        },
      ],
    };
    spyOnGetTodaysVenueHours.mockImplementation(() => {
      return undefined;
    });

    const component = mountWithTheme(
      <OpeningTimes openingTimes={mockOpeningTimes} />
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
    const component = shallowWithTheme(
      <OpeningTimes openingTimes={openingTimes} />
    );
    expect(component.html().match('Shop closed')).toBeTruthy();
  });
});
