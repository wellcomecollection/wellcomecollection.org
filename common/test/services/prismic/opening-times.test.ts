import {
  exceptionalOpeningDates,
  getExceptionalVenueDays,
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

const galleriesVenue = venues.find(venue => venue.id === 'Wsttgx8AAJeSNmJ4'); // TODO use getVenueById

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
});
