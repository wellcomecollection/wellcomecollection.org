import FooterOpeningTimes from './FooterOpeningTimes';
import {
  shallowWithTheme,
  mountWithTheme,
} from '../../../test/fixtures/enzyme-helpers';
import { openingTimes } from '../../../test/fixtures/components/opening-times';
import * as serviceOpeningTimes from '@weco/common/services/prismic/opening-times';

describe('FooterOpeningTimes', () => {
  const spyOnGetTodaysVenueHours = jest.spyOn(
    serviceOpeningTimes,
    'getTodaysVenueHours'
  );
  // set date as wednesday
  spyOnGetTodaysVenueHours.mockImplementation(() => {
    return { dayOfWeek: 'Wednesday', opens: '10:00', closes: '18:00' };
  });

  it('Should display opening times name restaurant as Kitchen', () => {
    const component = shallowWithTheme(
      <FooterOpeningTimes
        collectionOpeningTimes={openingTimes.collectionOpeningTimes}
      />
    );

    expect(component.html().match('Kitchen '));
  });

  it('Should not display render any opening times if opening times are empty', () => {
    const mockOpeningTimes = {
      collectionOpeningTimes: {
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
      },
    };
    spyOnGetTodaysVenueHours.mockImplementation(() => {
      return null;
    });

    const component = mountWithTheme(
      <FooterOpeningTimes
        collectionOpeningTimes={mockOpeningTimes.collectionOpeningTimes}
      />
    );

    const footerOpeningTimes = component.find('ul');
    expect(footerOpeningTimes.length).toEqual(1);
    expect(footerOpeningTimes.find('li').length).toEqual(0);
  });

  it('Should render venue opening times as closed', () => {
    const mockOpeningTimes = {
      collectionOpeningTimes: {
        placesOpeningHours: [
          {
            id: 'WsuaIB8AAH-yNylo',
            order: 5,
            name: 'Shop',
            openingHours: {
              regular: [
                { dayOfWeek: 'Monday', opens: null, closes: null },
                { dayOfWeek: 'Tuesday', opens: null, closes: null },
                { dayOfWeek: 'Wednesday', opens: null, closes: null },
                { dayOfWeek: 'Thursday', opens: null, closes: null },
                { dayOfWeek: 'Friday', opens: null, closes: null },
                { dayOfWeek: 'Saturday', opens: null, closes: null },
                { dayOfWeek: 'Sunday', opens: null, closes: null },
              ],
              exceptional: [],
            },
          },
        ],
      },
    };

    spyOnGetTodaysVenueHours.mockImplementation(() => {
      return { dayOfWeek: 'Wednesday', opens: null, closes: null };
    });
    const component = shallowWithTheme(
      <FooterOpeningTimes
        collectionOpeningTimes={mockOpeningTimes.collectionOpeningTimes}
      />
    );
    expect(component.html().match('Shop closed')).toBeTruthy();
  });
});
