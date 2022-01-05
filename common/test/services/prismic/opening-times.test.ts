import {
  exceptionalOpeningDates,
  // exceptionalOpeningPeriods,
  // exceptionalOpeningPeriodsAllDates,
  // getExceptionalOpeningPeriods,
  // getExceptionalVenueDays,
  // groupExceptionalVenueDays,
  // exceptionalFromRegular,
  // backfillExceptionalVenueDays,
  // groupConsecutiveDays,
  // getUpcomingExceptionalPeriods,
  // getExceptionalClosedDays,
  // createRegularDay,
  // convertJsonDateStringsToMoment,
  // parseCollectionVenue,
  // getVenueById,
  // parseOpeningTimes,
  // getTodaysVenueHours,
  // openingHoursToOpeningHoursSpecification,
  // getTodaysOpeningTimesForVenue,
} from '../../../services/prismic/opening-times';
import { london } from '../../../utils/format-date';
import { OverrideType } from '../../../model/opening-hours';

const openingTimes = {
  placesOpeningHours: [
    {
      id: 'Wsttgx8AAJeSNmJ4',
      order: 1,
      name: 'Galleries',
      openingHours: {
        regular: [
          {
            dayOfWeek: 'Monday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            dayOfWeek: 'Tuesday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Wednesday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Thursday',
            opens: '10:00',
            closes: '21:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Friday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Saturday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Sunday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
        ],
        exceptional: [],
      },
    },
    {
      id: 'WsuS_R8AACS1Nwlx',
      order: 2,
      name: 'Library',
      openingHours: {
        regular: [
          {
            dayOfWeek: 'Monday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            dayOfWeek: 'Tuesday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Wednesday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Thursday',
            opens: '10:00',
            closes: '20:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Friday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Saturday',
            opens: '10:00',
            closes: '16:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Sunday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
        ],
        exceptional: [],
      },
    },
    {
      id: 'WsuYER8AAOG_NyBA',
      order: 3,
      name: 'Restaurant',
      openingHours: {
        regular: [
          {
            dayOfWeek: 'Monday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            dayOfWeek: 'Tuesday',
            opens: '11:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Wednesday',
            opens: '11:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Thursday',
            opens: '11:00',
            closes: '21:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Friday',
            opens: '11:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Saturday',
            opens: '11:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Sunday',
            opens: '11:00',
            closes: '18:00',
            isClosed: false,
          },
        ],
        exceptional: [],
      },
    },
    {
      id: 'WsuZKh8AAOG_NyUo',
      order: 4,
      name: 'Café',
      openingHours: {
        regular: [
          {
            dayOfWeek: 'Monday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            dayOfWeek: 'Tuesday',
            opens: '08:30',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Wednesday',
            opens: '08:30',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Thursday',
            opens: '08:30',
            closes: '21:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Friday',
            opens: '08:30',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Saturday',
            opens: '09:30',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Sunday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
        ],
        exceptional: [],
      },
    },
    {
      id: 'WsuaIB8AAH-yNylo',
      order: 5,
      name: 'Shop',
      openingHours: {
        regular: [
          {
            dayOfWeek: 'Monday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            dayOfWeek: 'Tuesday',
            opens: '09:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Wednesday',
            opens: '09:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Thursday',
            opens: '09:00',
            closes: '21:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Friday',
            opens: '09:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Saturday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Sunday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
        ],
        exceptional: [],
      },
    },
  ],
};
const openingTimesWithExceptionalOpening = {
  // TODO this with map and ids
  placesOpeningHours: [
    {
      id: 'Wsttgx8AAJeSNmJ4',
      order: 1,
      name: 'Galleries',
      openingHours: {
        regular: [
          {
            dayOfWeek: 'Monday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            dayOfWeek: 'Tuesday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Wednesday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Thursday',
            opens: '10:00',
            closes: '21:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Friday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Saturday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Sunday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
        ],
        exceptional: [
          {
            overrideDate: london('2022-01-01'),
            overrideType: 'Christmas and New Year' as OverrideType, // TODO with these undefined, , // Easter | Bank Holiday | Christmas and New Year | Late spectacular | other
            opens: '12:00',
            closes: '14:00',
            isClosed: false,
          },
          {
            overrideDate: london('2021-12-31'),
            overrideType: 'Christmas and New Year' as OverrideType,
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
        ],
      },
    },
    {
      id: 'WsuS_R8AACS1Nwlx',
      order: 2,
      name: 'Library',
      openingHours: {
        regular: [
          {
            dayOfWeek: 'Monday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            dayOfWeek: 'Tuesday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Wednesday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Thursday',
            opens: '10:00',
            closes: '20:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Friday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Saturday',
            opens: '10:00',
            closes: '16:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Sunday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
        ],
        exceptional: [
          {
            overrideDate: london('2021-12-31'),
            overrideType: 'Christmas and New Year' as OverrideType,
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
        ],
      },
    },
    {
      id: 'WsuYER8AAOG_NyBA',
      order: 3,
      name: 'Restaurant',
      openingHours: {
        regular: [
          {
            dayOfWeek: 'Monday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            dayOfWeek: 'Tuesday',
            opens: '11:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Wednesday',
            opens: '11:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Thursday',
            opens: '11:00',
            closes: '21:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Friday',
            opens: '11:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Saturday',
            opens: '11:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Sunday',
            opens: '11:00',
            closes: '18:00',
            isClosed: false,
          },
        ],
        exceptional: [
          {
            overrideDate: london('2022-04-10'),
            overrideType: 'other' as OverrideType,
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
        ],
      },
    },
    {
      id: 'WsuZKh8AAOG_NyUo',
      order: 4,
      name: 'Café',
      openingHours: {
        regular: [
          {
            dayOfWeek: 'Monday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            dayOfWeek: 'Tuesday',
            opens: '08:30',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Wednesday',
            opens: '08:30',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Thursday',
            opens: '08:30',
            closes: '21:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Friday',
            opens: '08:30',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Saturday',
            opens: '09:30',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Sunday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
        ],
        exceptional: [],
      },
    },
    {
      id: 'WsuaIB8AAH-yNylo',
      order: 5,
      name: 'Shop',
      openingHours: {
        regular: [
          {
            dayOfWeek: 'Monday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            dayOfWeek: 'Tuesday',
            opens: '09:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Wednesday',
            opens: '09:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Thursday',
            opens: '09:00',
            closes: '21:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Friday',
            opens: '09:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Saturday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
          {
            dayOfWeek: 'Sunday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
        ],
        exceptional: [],
      },
    },
  ],
};

// TODO need to be able to set the date for some of the tests? upcomingExceptional / Today's etc.
describe('opening-times', () => {
  describe('exceptionalOpeningDates: returns dates on which any venue has exceptional opening hours.', () => {
    it('returns an empty array if no venues have dates with exceptional opening hours', () => {
      const result = exceptionalOpeningDates(openingTimes);
      expect(result).toEqual([]);
    });
    // it('returns all dates that have exceptional opening hours for any venue', () => {
    //   const result = exceptionalOpeningDates(
    //     openingTimesWithExceptionalOpening
    //   );
    // });
    // it('does not include a date more than once', () => {
    //   const result = exceptionalOpeningDates(openingTimes); // array unique values
    // });
  });
});
