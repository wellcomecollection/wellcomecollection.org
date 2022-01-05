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
import { openingTimes } from '../../../test/fixtures/components/opening-times';
import { london } from '../../../utils/format-date';

const openingTimesWithoutExceptionalDates = {
  placesOpeningHours: openingTimes.placesOpeningHours.map(venue => {
    return {
      ...venue,
      openingHours: {
        ...venue.openingHours,
        exceptional: [],
      },
    };
  }),
};

// TODO need to be able to set the date for some of the tests? upcomingExceptional / Today's etc.
describe('opening-times', () => {
  describe('exceptionalOpeningDates: returns all the dates on which any venue has exceptional opening hours.', () => {
    it('returns an empty array if no venues have dates with exceptional opening hours', () => {
      const result = exceptionalOpeningDates(
        openingTimesWithoutExceptionalDates
      );
      expect(result).toEqual([]);
    });
    it('returns all dates that have exceptional opening hours for any venue', () => {
      const result = exceptionalOpeningDates(openingTimes);
      expect(result).toEqual([
        {
          overrideDate: london('2021-01-05'),
          overrideType: 'Bank holiday',
        },
        {
          overrideDate: london('2021-12-20'),
          overrideType: 'Christmas and New Year',
        },
        {
          overrideDate: london('2021-12-31'),
          overrideType: 'Christmas and New Year',
        },
        {
          overrideDate: london('2022-01-01'),
          overrideType: 'Christmas and New Year',
        },
        {
          overrideDate: london('2022-02-04'),
          overrideType: 'Bank holiday',
        },
        {
          overrideDate: london('2022-04-10'),
          overrideType: 'other',
        },
      ]);
    });
    it('does not include a date more than once', () => {
      const result = exceptionalOpeningDates(openingTimes);
      const uniqueDates = new Set(
        result.map(date => date.overrideDate?.toString())
      );
      expect(result.length).toEqual(uniqueDates.size);
    });
  });
});
