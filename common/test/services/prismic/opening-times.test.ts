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
  describe('exceptionalOpeningDates: returns dates on which any venue has exceptional opening hours.', () => {
    // it('returns an empty array if no venues have dates with exceptional opening hours', () => {
    //   const result = exceptionalOpeningDates(openingTimes);
    //   expect(result).toEqual([]);
    // });
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
