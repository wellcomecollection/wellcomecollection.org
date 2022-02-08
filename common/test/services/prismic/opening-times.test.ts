import {
  exceptionalOpeningDates,
  exceptionalOpeningPeriods,
  exceptionalOpeningPeriodsAllDates,
  getExceptionalVenueDays,
  getVenueById,
} from '../../../services/prismic/opening-times';
import { venues } from '../../../test/fixtures/components/venues';
import { london } from '../../../utils/format-date';

const venuesWithoutExceptionalDates = venues.map(venue => {
  return {
    ...venue,
    openingHours: {
      ...venue.openingHours,
      exceptional: [],
    },
  };
});
const galleriesVenue = getVenueById(venues, 'Wsttgx8AAJeSNmJ4');

describe('opening-times', () => {
  describe('exceptionalOpeningDates: returns unique dates on which exceptional opening hours occur, taken from all venues.', () => {
    it('returns an empty array if no venues have dates with exceptional opening hours', () => {
      const result = exceptionalOpeningDates(venuesWithoutExceptionalDates);
      expect(result).toEqual([]);
    });
    it('returns all dates that have exceptional opening hours for any venue', () => {
      const result = exceptionalOpeningDates(venues);
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
          overrideDate: london('2022-02-05'),
          overrideType: 'Bank holiday',
        },
        {
          overrideDate: london('2022-04-10'),
          overrideType: 'other',
        },
        {
          overrideDate: london('2022-12-28'),
          overrideType: 'Christmas and New Year',
        },
        {
          overrideDate: london('2022-12-30'),
          overrideType: 'Christmas and New Year',
        },
        {
          overrideDate: london('2022-12-31'),
          overrideType: 'Christmas and New Year',
        },
        {
          overrideDate: london('2023-01-01'),
          overrideType: 'Christmas and New Year',
        },
      ]);
    });
    it('does not include a date more than once', () => {
      const result = exceptionalOpeningDates(venues);
      const uniqueDates = new Set(
        result.map(date => date.overrideDate?.toString())
      );
      expect(result.length).toEqual(uniqueDates.size);
    });
  });

  describe('exceptionalOpeningPeriods: groups together override dates based on their proximity to each other and their override type, so we can display them together', () => {
    it('groups together dates with the same overrideType, so that there is never more than 4 days between one date and the next', () => {
      const result = exceptionalOpeningPeriods([
        { overrideType: 'other', overrideDate: london('2020-01-01') },
        { overrideType: 'other', overrideDate: london('2020-01-03') },
        { overrideType: 'other', overrideDate: london('2020-01-06') },
        { overrideType: 'other', overrideDate: london('2020-01-10') },
        { overrideType: 'other', overrideDate: london('2020-01-15') },
        { overrideType: 'other', overrideDate: london('2020-01-21') },
      ]);
      expect(result).toEqual([
        {
          type: 'other',
          dates: [
            london('2020-01-01'),
            london('2020-01-03'),
            london('2020-01-06'),
            london('2020-01-10'),
            london('2020-01-15'),
          ],
        },
        {
          type: 'other',
          dates: [london('2020-01-21')],
        },
      ]);
    });

    it('puts OverrideDates with the same overrideDate but different overrideType into different groups', () => {
      const result = exceptionalOpeningPeriods([
        { overrideType: 'other', overrideDate: london('2020-01-02') },
        { overrideType: 'other', overrideDate: london('2020-01-04') },
        {
          overrideType: 'Christmas and New Year',
          overrideDate: london('2020-01-02'),
        },
      ]);
      expect(result).toEqual([
        {
          type: 'other',
          dates: [london('2020-01-02'), london('2020-01-04')],
        },
        {
          type: 'Christmas and New Year',
          dates: [london('2020-01-02')],
        },
      ]);
    });

    it('puts dates in chronological order within their groups', () => {
      const result = exceptionalOpeningPeriods([
        { overrideType: 'other', overrideDate: london('2020-01-04') },
        { overrideType: 'other', overrideDate: london('2020-01-07') },
        { overrideType: 'other', overrideDate: london('2020-01-02') },
      ]);
      expect(result).toEqual([
        {
          type: 'other',
          dates: [
            london('2020-01-02'),
            london('2020-01-04'),
            london('2020-01-07'),
          ],
        },
      ]);
    });

    it('puts Groups in chronological order based on their earliest date', () => {
      const result = exceptionalOpeningPeriods([
        {
          overrideType: 'Bank holiday',
          overrideDate: london('2021-01-05'),
        },
        { overrideType: 'other', overrideDate: london('2021-01-04') },
        {
          overrideType: 'Christmas and New Year',
          overrideDate: london('2021-12-30'),
        },
        { overrideType: 'other', overrideDate: london('2021-01-02') },
        { overrideType: 'other', overrideDate: london('2021-04-10') },
      ]);
      expect(result).toEqual([
        {
          type: 'other',
          dates: [london('2021-01-02'), london('2021-01-04')],
        },
        {
          type: 'Bank holiday',
          dates: [london('2021-01-05')],
        },
        {
          type: 'other',
          dates: [london('2021-04-10')],
        },
        {
          type: 'Christmas and New Year',
          dates: [london('2021-12-30')],
        },
      ]);
    });
  });

  describe('exceptionalOpeningPeriodsAllDates: adds dates to the dates array of a period, so that they are consecutive from the first to last', () => {
    it('fills in missing dates', () => {
      const result = exceptionalOpeningPeriodsAllDates([
        {
          type: 'Christmas and New Year',
          dates: [
            london('2020-12-25'),
            london('2020-12-28'),
            london('2021-01-01'),
            london('2021-01-03'),
          ],
        },
      ]);
      expect(result[0].dates.length).toEqual(10);
      expect(result[0].dates[2].isSame(london(london('2020-12-27')))).toBe(
        true
      );
      expect(result[0].dates[5].isSame(london(london('2020-12-30')))).toBe(
        true
      );
    });
  });

  describe('getExceptionalVenueDays', () => {
    it('returns all exceptional override dates for a venue', () => {
      const result = getExceptionalVenueDays(galleriesVenue!);
      expect(result).toEqual([
        {
          overrideDate: london('2022-01-01'),
          overrideType: 'Christmas and New Year',
          opens: '12:00',
          closes: '14:00',
          isClosed: false,
        },
        {
          overrideDate: london('2021-12-31'),
          overrideType: 'Christmas and New Year',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: london('2021-12-20'),
          overrideType: 'Christmas and New Year',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: london('2022-02-04'),
          overrideType: 'Bank holiday',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: london('2022-02-05'),
          overrideType: 'Bank holiday',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: london('2021-01-05'),
          overrideType: 'Bank holiday',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: london('2022-12-31'),
          overrideType: 'Christmas and New Year',
          opens: '10:00',
          closes: '14:00',
          isClosed: false,
        },
      ]);
    });
  });

  describe('getVenueById', () => {
    it('returns a venue object with a matching id from an array of venues', () => {
      const result = getVenueById(venues, 'Wsttgx8AAJeSNmJ4')!;
      expect(result.name).toEqual('Galleries and Reading Room');
    });
  });
});
