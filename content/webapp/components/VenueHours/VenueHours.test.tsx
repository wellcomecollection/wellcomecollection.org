import {
  DifferentToRegularTime,
  OverrideDay,
  UnusualOpeningHours,
} from './VenueHours';
import {
  ExceptionalOpeningHoursDay,
  OpeningHoursDay,
} from '@weco/common/model/opening-hours';
import { shallow } from 'enzyme';

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
      const component = shallow(
        <UnusualOpeningHours
          regular={closedMonday}
          exceptional={closedExceptionalMonday}
        />
      );

      expect(
        component.matchesElement(
          <>
            <OverrideDay>Monday 26 December</OverrideDay>
            Closed
          </>
        )
      ).toBe(true);
    });
  });

  describe('Case 2: the venue is closed, and wouldn’t be on a regular day', () => {
    it('marks “Closed” as unusual if the venue isn’t usually closed this day', () => {
      const component = shallow(
        <UnusualOpeningHours
          regular={openMonday}
          exceptional={closedExceptionalMonday}
        />
      );

      expect(
        component.matchesElement(
          <>
            <OverrideDay>Monday 26 December</OverrideDay>{' '}
            <DifferentToRegularTime>Closed</DifferentToRegularTime>
          </>
        )
      ).toBe(true);
    });
  });

  describe('Case 3: the venue is open, but would normally be closed', () => {
    it('marks the opening times as unusual if the venue isn’t usually open', () => {
      const component = shallow(
        <UnusualOpeningHours
          regular={closedMonday}
          exceptional={openExceptionalMonday}
        />
      );

      expect(
        component.matchesElement(
          <>
            <OverrideDay>Monday 26 December</OverrideDay>{' '}
            <DifferentToRegularTime>10:00 – 18:00</DifferentToRegularTime>
          </>
        )
      ).toBe(true);
    });
  });

  describe('Case 4: the venue is open', () => {
    it('doesn’t mark the opening times as unusual if they match a regular day', () => {
      const component = shallow(
        <UnusualOpeningHours
          regular={openMonday}
          exceptional={openExceptionalMonday}
        />
      );

      // This and subsequent tests are a bit fragile and weird; for some reason the
      // matchesElement() approach I used in the other tests doesn't work here.
      expect(component.debug()).toBe(`<Fragment>
  <VenueHours__OverrideDay>
    Monday
     
    26 December
  </VenueHours__OverrideDay>
   
  10:00
   – 
  18:00
</Fragment>`);

      //   expect(
      //     component.matchesElement(
      //       <>
      //         <OverrideDay>Monday 26 December</OverrideDay> {'10:00 – 18:00'}
      //       </>
      //     )
      //   ).toBe(true);
    });

    it('marks a non-standard opening time as unusual', () => {
      const component = shallow(
        <UnusualOpeningHours
          regular={openMonday}
          exceptional={{ ...openExceptionalMonday, opens: '02:00' }}
        />
      );

      expect(component.debug()).toBe(`<Fragment>
  <VenueHours__OverrideDay>
    Monday
     
    26 December
  </VenueHours__OverrideDay>
   
  <VenueHours__DifferentToRegularTime>
    02:00
  </VenueHours__DifferentToRegularTime>
   – 
  18:00
</Fragment>`);
    });

    it('marks a non-standard closing time as unusual', () => {
      const component = shallow(
        <UnusualOpeningHours
          regular={openMonday}
          exceptional={{ ...openExceptionalMonday, closes: '23:00' }}
        />
      );

      expect(component.debug()).toBe(`<Fragment>
  <VenueHours__OverrideDay>
    Monday
     
    26 December
  </VenueHours__OverrideDay>
   
  10:00
   – 
  <VenueHours__DifferentToRegularTime>
    23:00
  </VenueHours__DifferentToRegularTime>
</Fragment>`);
    });

    it('marks non-standard opening/closing times as both unusual', () => {
      const component = shallow(
        <UnusualOpeningHours
          regular={openMonday}
          exceptional={{
            ...openExceptionalMonday,
            opens: '02:00',
            closes: '23:00',
          }}
        />
      );

      expect(component.debug()).toBe(`<Fragment>
  <VenueHours__OverrideDay>
    Monday
     
    26 December
  </VenueHours__OverrideDay>
   
  <VenueHours__DifferentToRegularTime>
    02:00
  </VenueHours__DifferentToRegularTime>
   – 
  <VenueHours__DifferentToRegularTime>
    23:00
  </VenueHours__DifferentToRegularTime>
</Fragment>`);
    });
  });
});
