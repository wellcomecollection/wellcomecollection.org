import {
  ExceptionalOpeningHoursDay,
  OpeningHoursDay,
} from '@weco/common/model/opening-hours';
import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';

import UnusualOpeningHours from './VenueHours.UnusualOpeningHours';

const closedMonday: OpeningHoursDay = {
  dayOfWeek: 'Monday',
  opens: '00:00',
  closes: '00:00',
  isClosed: true,
};

const openMonday: OpeningHoursDay = {
  dayOfWeek: 'Monday',
  opens: '10:00',
  closes: '18:00',
  isClosed: false,
};

const openExceptionalMonday: ExceptionalOpeningHoursDay = {
  overrideDate: new Date('2022-12-26T00:00:00.000Z'),
  overrideType: 'Christmas and New Year',
  opens: '10:00',
  closes: '18:00',
  isClosed: false,
};

const closedExceptionalMonday: ExceptionalOpeningHoursDay = {
  overrideDate: new Date('2022-12-26T00:00:00.000Z'),
  overrideType: 'Christmas and New Year',
  opens: '00:00',
  closes: '00:00',
  isClosed: true,
};

describe('UnusualOpeningHours', () => {
  describe('Case 1: the venue is closed, and would have been on a regular day', () => {
    it('renders a regular “Closed” time if the venue was already closed this day', () => {
      const component = renderWithTheme(
        <UnusualOpeningHours
          regular={closedMonday}
          exceptional={closedExceptionalMonday}
        />
      );

      expect(component.container.textContent).toEqual(
        'Monday 26 December Closed'
      );
    });
  });

  describe('Case 2: the venue is closed, and wouldn’t be on a regular day', () => {
    it('marks “Closed” as unusual if the venue isn’t usually closed this day', () => {
      const component = renderWithTheme(
        <UnusualOpeningHours
          regular={openMonday}
          exceptional={closedExceptionalMonday}
        />
      );

      expect(
        component.container.outerHTML.includes('DifferentToRegularTime')
      ).toBe(true);
      expect(component.container.textContent).toBe('Monday 26 December Closed');
    });
  });

  describe('Case 3: the venue is open, but would normally be closed', () => {
    it('marks the opening times as unusual if the venue isn’t usually open', () => {
      const component = renderWithTheme(
        <UnusualOpeningHours
          regular={closedMonday}
          exceptional={openExceptionalMonday}
        />
      );
      expect(
        component.container.outerHTML.includes('DifferentToRegularTime')
      ).toBe(true);
      expect(component.container.textContent).toBe(
        'Monday 26 December 10:00 – 18:00'
      );
    });
  });

  describe('Case 4: the venue is open', () => {
    it('doesn’t mark the opening times as unusual if they match a regular day', () => {
      const component = renderWithTheme(
        <UnusualOpeningHours
          regular={openMonday}
          exceptional={openExceptionalMonday}
        />
      );

      expect(
        component.container.outerHTML.includes('DifferentToRegularTime')
      ).toBe(false);
      expect(component.container.textContent).toBe(
        'Monday 26 December 10:00 – 18:00'
      );
    });

    it('marks a non-standard opening time as unusual', () => {
      const component = renderWithTheme(
        <UnusualOpeningHours
          regular={openMonday}
          exceptional={{ ...openExceptionalMonday, opens: '02:00' }}
        />
      );
      expect(
        component.container.outerHTML.includes('DifferentToRegularTime')
      ).toBe(true);
      expect(component.container.textContent).toBe(
        'Monday 26 December 02:00 – 18:00'
      );
    });

    it('marks a non-standard closing time as unusual', () => {
      const component = renderWithTheme(
        <UnusualOpeningHours
          regular={openMonday}
          exceptional={{ ...openExceptionalMonday, closes: '23:00' }}
        />
      );
      expect(
        component.container.outerHTML.includes('DifferentToRegularTime')
      ).toBe(true);
      expect(component.container.textContent).toBe(
        'Monday 26 December 10:00 – 23:00'
      );
    });

    it('marks non-standard opening/closing times as both unusual', () => {
      const component = renderWithTheme(
        <UnusualOpeningHours
          regular={openMonday}
          exceptional={{
            ...openExceptionalMonday,
            opens: '02:00',
            closes: '23:00',
          }}
        />
      );
      expect(
        component.container.outerHTML.includes('DifferentToRegularTime')
      ).toBe(true);
      expect(
        (component.container.outerHTML.match(/DifferentToRegularTime/g) || [])
          .length
      ).toBe(2);
      expect(component.container.textContent).toBe(
        'Monday 26 December 02:00 – 23:00'
      );
    });
  });
});
