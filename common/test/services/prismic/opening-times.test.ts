import {
  getOverrideDatesForAllVenues,
  groupOverrideDates,
  completeDateRangeForExceptionalPeriods,
  getExceptionalVenueDays,
  groupExceptionalVenueDays,
  exceptionalFromRegular,
  backfillExceptionalVenueDays,
  getUpcomingExceptionalPeriods,
  getVenueById,
  getTodaysVenueHours,
  groupConsecutiveExceptionalDays,
} from '../../../services/prismic/opening-times';
import { venues } from '../../../test/fixtures/components/venues';
import {
  ExceptionalOpeningHoursDay,
  OverrideType,
  Venue,
} from '../../../model/opening-hours';
import * as dateUtils from '../../../utils/dates';

const venuesWithoutExceptionalDates = venues.map(venue => {
  return {
    ...venue,
    openingHours: {
      ...venue.openingHours,
      exceptional: [],
    },
  };
});

const libraryVenue = getVenueById(venues, 'WsuS_R8AACS1Nwlx')!;
const galleriesVenue = getVenueById(venues, 'Wsttgx8AAJeSNmJ4')!;

describe('opening-times', () => {
  describe('getOverrideDatesForAllVenues: returns unique dates on which exceptional opening hours occur, taken from all venues.', () => {
    it('returns an empty array if no venues have dates with exceptional opening hours', () => {
      const result = getOverrideDatesForAllVenues(
        venuesWithoutExceptionalDates
      );
      expect(result).toEqual([]);
    });
    it('returns all dates that have exceptional opening hours for any venue', () => {
      const result = getOverrideDatesForAllVenues(venues);
      expect(result).toEqual([
        {
          overrideDate: new Date('2021-01-05'),
          overrideType: 'Bank holiday',
        },
        {
          overrideDate: new Date('2021-12-20'),
          overrideType: 'Christmas and New Year',
        },
        {
          overrideDate: new Date('2021-12-31'),
          overrideType: 'Christmas and New Year',
        },
        {
          overrideDate: new Date('2022-01-01'),
          overrideType: 'Christmas and New Year',
        },
        {
          overrideDate: new Date('2022-02-04'),
          overrideType: 'Bank holiday',
        },
        {
          overrideDate: new Date('2022-02-05'),
          overrideType: 'Bank holiday',
        },
        {
          overrideDate: new Date('2022-04-10'),
          overrideType: 'other',
        },
        {
          overrideDate: new Date('2022-12-28'),
          overrideType: 'Christmas and New Year',
        },
        {
          overrideDate: new Date('2022-12-30'),
          overrideType: 'Christmas and New Year',
        },
        {
          overrideDate: new Date('2022-12-31'),
          overrideType: 'Christmas and New Year',
        },
        {
          overrideDate: new Date('2023-01-01'),
          overrideType: 'Christmas and New Year',
        },
      ]);
    });
    it('does not include a date more than once', () => {
      const result = getOverrideDatesForAllVenues(venues);
      const uniqueDates = new Set(
        result.map(date => date.overrideDate?.toString())
      );
      expect(result.length).toEqual(uniqueDates.size);
    });
    it('sorts the list of returned dates', () => {
      const venue = {
        ...libraryVenue,
        openingHours: {
          ...libraryVenue.openingHours,
          exceptional: [
            new Date('2003-03-03'),
            new Date('2001-01-01'),
            new Date('2002-02-02'),
          ].map(overrideDate => ({
            overrideDate,
            overrideType: 'other' as OverrideType,
            opens: '00:00',
            closes: '00:00',
          })),
        },
      };
      const result = getOverrideDatesForAllVenues([venue]);
      expect(result.map(d => d.overrideDate)).toEqual([
        new Date('2001-01-01'),
        new Date('2002-02-02'),
        new Date('2003-03-03'),
      ]);
    });
  });

  describe('groupOverrideDates: groups together override dates based on their proximity to each other and their override type, so we can display them together', () => {
    it('groups together dates with the same overrideType, so that there is never more than 4 days between one date and the next', () => {
      const result = groupOverrideDates([
        { overrideType: 'other', overrideDate: new Date('2020-01-01') },
        { overrideType: 'other', overrideDate: new Date('2020-01-03') },
        { overrideType: 'other', overrideDate: new Date('2020-01-06') },
        { overrideType: 'other', overrideDate: new Date('2020-01-10') },
        { overrideType: 'other', overrideDate: new Date('2020-01-15') },
        { overrideType: 'other', overrideDate: new Date('2020-01-21') },
      ]);
      expect(result).toEqual([
        {
          type: 'other',
          dates: [
            new Date('2020-01-01'),
            new Date('2020-01-03'),
            new Date('2020-01-06'),
            new Date('2020-01-10'),
            new Date('2020-01-15'),
          ],
        },
        {
          type: 'other',
          dates: [new Date('2020-01-21')],
        },
      ]);
    });

    it('puts OverrideDates with the same overrideDate but different overrideType into different groups', () => {
      const result = groupOverrideDates([
        { overrideType: 'other', overrideDate: new Date('2020-01-02') },
        { overrideType: 'other', overrideDate: new Date('2020-01-04') },
        {
          overrideType: 'Christmas and New Year',
          overrideDate: new Date('2020-01-02'),
        },
      ]);
      expect(result).toEqual([
        {
          type: 'other',
          dates: [new Date('2020-01-02'), new Date('2020-01-04')],
        },
        {
          type: 'Christmas and New Year',
          dates: [new Date('2020-01-02')],
        },
      ]);
    });

    it('puts dates in chronological order within their groups', () => {
      const result = groupOverrideDates([
        { overrideType: 'other', overrideDate: new Date('2020-01-04') },
        { overrideType: 'other', overrideDate: new Date('2020-01-07') },
        { overrideType: 'other', overrideDate: new Date('2020-01-02') },
      ]);
      expect(result).toEqual([
        {
          type: 'other',
          dates: [
            new Date('2020-01-02'),
            new Date('2020-01-04'),
            new Date('2020-01-07'),
          ],
        },
      ]);
    });

    it('puts Groups in chronological order based on their earliest date', () => {
      const result = groupOverrideDates([
        {
          overrideType: 'Bank holiday',
          overrideDate: new Date('2021-01-05'),
        },
        { overrideType: 'other', overrideDate: new Date('2021-01-04') },
        {
          overrideType: 'Christmas and New Year',
          overrideDate: new Date('2021-12-30'),
        },
        { overrideType: 'other', overrideDate: new Date('2021-01-02') },
        { overrideType: 'other', overrideDate: new Date('2021-04-10') },
      ]);
      expect(result).toEqual([
        {
          type: 'other',
          dates: [new Date('2021-01-02'), new Date('2021-01-04')],
        },
        {
          type: 'Bank holiday',
          dates: [new Date('2021-01-05')],
        },
        {
          type: 'other',
          dates: [new Date('2021-04-10')],
        },
        {
          type: 'Christmas and New Year',
          dates: [new Date('2021-12-30')],
        },
      ]);
    });
  });

  describe('completeDateRangeForExceptionalPeriods: adds dates to the dates array of a period, so that they are consecutive from the first to last', () => {
    it('fills in missing dates', () => {
      const result = completeDateRangeForExceptionalPeriods([
        {
          type: 'Christmas and New Year',
          dates: [
            new Date('2020-12-25'),
            new Date('2020-12-28'),
            new Date('2021-01-01'),
            new Date('2021-01-03'),
          ],
        },
      ]);
      expect(result[0].dates.length).toEqual(10);
      expect(result[0].dates[2]).toEqual(new Date('2020-12-27'));
      expect(result[0].dates[5]).toEqual(new Date('2020-12-30'));
    });
  });

  describe('getExceptionalVenueDays', () => {
    it('returns all exceptional override dates for a venue', () => {
      const result = getExceptionalVenueDays(galleriesVenue!);
      expect(result).toEqual([
        {
          overrideDate: new Date('2022-01-01'),
          overrideType: 'Christmas and New Year',
          opens: '12:00',
          closes: '14:00',
          isClosed: false,
        },
        {
          overrideDate: new Date('2021-12-31'),
          overrideType: 'Christmas and New Year',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2021-12-20'),
          overrideType: 'Christmas and New Year',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2022-02-04'),
          overrideType: 'Bank holiday',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2022-02-05'),
          overrideType: 'Bank holiday',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2021-01-05'),
          overrideType: 'Bank holiday',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2022-12-31'),
          overrideType: 'Christmas and New Year',
          opens: '10:00',
          closes: '14:00',
          isClosed: false,
        },
      ]);
    });
  });

  describe('groupExceptionalVenueDays', () => {
    it('groups exceptional days, so that each day within a group fall within 14 days of the first day', () => {
      const exceptionalDays: ExceptionalOpeningHoursDay[] = [
        {
          overrideDate: new Date('2021-12-21'),
          overrideType: 'Bank holiday',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2022-12-28'),
          overrideType: 'Christmas and New Year',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2022-12-29'),
          overrideType: 'Bank holiday',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2021-12-29'),
          overrideType: 'Bank holiday',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2022-12-30'),
          overrideType: 'Christmas and New Year',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2022-12-31'),
          overrideType: 'Christmas and New Year',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2023-01-01'),
          overrideType: 'Christmas and New Year',
          opens: '20:00',
          closes: '21:00',
          isClosed: false,
        },
      ];
      const result = groupExceptionalVenueDays(exceptionalDays);

      expect(result).toEqual([
        [
          {
            overrideDate: new Date('2021-12-21'),
            overrideType: 'Bank holiday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            overrideDate: new Date('2021-12-29'),
            overrideType: 'Bank holiday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
        ],
        [
          {
            overrideDate: new Date('2022-12-28'),
            overrideType: 'Christmas and New Year',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            overrideDate: new Date('2022-12-29'),
            overrideType: 'Bank holiday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            overrideDate: new Date('2022-12-30'),
            overrideType: 'Christmas and New Year',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            overrideDate: new Date('2022-12-31'),
            overrideType: 'Christmas and New Year',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            overrideDate: new Date('2023-01-01'),
            overrideType: 'Christmas and New Year',
            opens: '20:00',
            closes: '21:00',
            isClosed: false,
          },
        ],
      ]);
    });
  });

  describe('exceptionalFromRegular', () => {
    it('returns an ExceptionalOpeningHoursDay type for a particular date and venue, generated from the regular hours of that venue.', () => {
      const result = exceptionalFromRegular(
        libraryVenue!,
        new Date('2021-12-21'),
        'Bank holiday'
      );

      expect(result).toEqual({
        overrideDate: new Date('2021-12-21'),
        overrideType: 'Bank holiday',
        opens: '10:00',
        closes: '18:00',
        isClosed: false,
      });
    });
  });

  describe("backfillExceptionalVenueDays: returns the venue's exceptional opening times for each date, and if there is no exceptional opening time for a specific date, then it uses the venue's regular opening times for that day.", () => {
    it('returns an exceptional override date type for each of the dates provided', () => {
      const result = backfillExceptionalVenueDays(libraryVenue!, [
        {
          type: 'Christmas and New Year',
          dates: [
            new Date('2022-12-28'),
            new Date('2022-12-29'),
            new Date('2022-12-30'),
            new Date('2022-12-31'),
            new Date('2023-01-01'),
            new Date('2023-01-02'),
          ],
        },
        {
          type: 'Bank holiday',
          dates: [new Date('2021-10-05')],
        },
      ]);

      expect(result).toEqual([
        [
          {
            overrideDate: new Date('2022-12-28'),
            overrideType: 'Christmas and New Year',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            overrideDate: new Date('2022-12-29'),
            overrideType: 'Christmas and New Year',
            opens: '10:00',
            closes: '20:00',
            isClosed: false,
          },
          {
            overrideDate: new Date('2022-12-30'),
            overrideType: 'Christmas and New Year',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            overrideDate: new Date('2022-12-31'),
            overrideType: 'Christmas and New Year',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            overrideDate: new Date('2023-01-01'),
            overrideType: 'Christmas and New Year',
            opens: '20:00',
            closes: '21:00',
            isClosed: false,
          },
          {
            overrideDate: new Date('2023-01-02'),
            overrideType: 'Christmas and New Year',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
        ],
        [
          {
            overrideDate: new Date('2021-10-05'),
            overrideType: 'Bank holiday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
        ],
      ]);
    });

    // We don't backfill if its type is other - see https://github.com/wellcomecollection/wellcomecollection.org/pull/4437
    it("it doesn't return the regular hours if the override type is 'other'", () => {
      const result = backfillExceptionalVenueDays(libraryVenue!, [
        {
          type: 'Bank holiday',
          dates: [new Date('2021-10-05')],
        },
        {
          type: 'other',
          dates: [new Date('2021-10-08')],
        },
      ]);

      expect(result).toEqual([
        [
          {
            overrideDate: new Date('2021-10-05'),
            overrideType: 'Bank holiday',
            opens: '10:00',
            closes: '18:00',
            isClosed: false,
          },
        ],
        [],
      ]);
    });
  });

  describe('getUpcomingExceptionalPeriods', () => {
    const exceptionalPeriods: ExceptionalOpeningHoursDay[][] = [
      [
        {
          overrideDate: new Date('2021-12-29'),
          overrideType: 'Christmas and New Year',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2021-12-30'),
          overrideType: 'Christmas and New Year',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2021-12-31'),
          overrideType: 'Christmas and New Year',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2022-01-01'),
          overrideType: 'Christmas and New Year',
          opens: '12:00',
          closes: '14:00',
          isClosed: false,
        },
      ],
      [
        {
          overrideDate: new Date('2022-02-04'),
          overrideType: 'Bank holiday',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2022-02-05'),
          overrideType: 'Bank holiday',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
      ],
    ];

    it('returns an empty array if no exceptional periods have days that occur in the next 28 days', () => {
      const spyOnLondon = jest.spyOn(dateUtils, 'today');
      // set specific date, so we have something consistent to test against
      spyOnLondon.mockImplementation(() => {
        return new Date('2021-11-30');
      });
      const result = getUpcomingExceptionalPeriods(exceptionalPeriods);
      expect(result).toEqual([]);
    });

    it('returns exceptional periods that have days that occur in the next 28 days', () => {
      const spyOnLondon = jest.spyOn(dateUtils, 'today');
      // set specific date, so we have something consistent to test against
      spyOnLondon.mockImplementation(() => {
        return new Date('2021-12-10');
      });
      const result = getUpcomingExceptionalPeriods(exceptionalPeriods);
      expect(result).toEqual([
        [
          {
            overrideDate: new Date('2021-12-29'),
            overrideType: 'Christmas and New Year',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            overrideDate: new Date('2021-12-30'),
            overrideType: 'Christmas and New Year',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            overrideDate: new Date('2021-12-31'),
            overrideType: 'Christmas and New Year',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            overrideDate: new Date('2022-01-01'),
            overrideType: 'Christmas and New Year',
            opens: '12:00',
            closes: '14:00',
            isClosed: false,
          },
        ],
      ]);
    });

    it('returns exceptional periods that start today', () => {
      const exceptionalPeriods: ExceptionalOpeningHoursDay[][] = [
        [
          {
            overrideDate: new Date('2022-09-19T00:00:00.000+0100'),
            overrideType: 'Bank holiday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
        ],
      ];

      const spyOnToday = jest.spyOn(dateUtils, 'today');
      spyOnToday.mockImplementation(() => {
        return new Date('2022-09-19T00:00:00Z');
      });

      const result = getUpcomingExceptionalPeriods(exceptionalPeriods);
      expect(result).toEqual(exceptionalPeriods);
    });
  });

  describe('getVenueById', () => {
    it('returns a venue object with a matching id from an array of venues', () => {
      const result = getVenueById(venues, 'Wsttgx8AAJeSNmJ4')!;
      expect(result.name).toEqual('Galleries and Reading Room');
    });
  });

  describe("getTodaysVenueHours: returns the venue's opening times for the current day", () => {
    it('returns the regular opening hours, if there are no exceptional opening times for the day.', () => {
      const spyOnToday = jest.spyOn(dateUtils, 'today');
      // set Day as Wednesday, so we have something consistent to test against
      spyOnToday.mockImplementation(() => {
        return new Date('2022-01-19T00:00:00Z');
      });

      const result = getTodaysVenueHours(libraryVenue!);

      expect(result).toEqual({
        dayOfWeek: 'Wednesday',
        opens: '10:00',
        closes: '18:00',
        isClosed: false,
      });
    });

    it('returns the exceptional times if there are some for the day.', () => {
      const spyOnToday = jest.spyOn(dateUtils, 'today');
      // set Day to a date we have exceptional opening times for
      spyOnToday.mockImplementation(() => {
        return new Date('2023-01-01T00:00:00Z');
      });

      const result = getTodaysVenueHours(libraryVenue!);
      expect(result).toEqual({
        overrideDate: new Date('2023-01-01'),
        overrideType: 'Christmas and New Year',
        opens: '20:00',
        closes: '21:00',
        isClosed: false,
      });
    });

    // This is based on a specific issue reported for a bank holiday closure.
    // See https://wellcome.slack.com/archives/C3TQSF63C/p1663495675591289
    //
    // This is the calendar for the month in question (`cal sept 2022`):
    //
    //    September 2022
    // Su Mo Tu We Th Fr Sa
    // 18 19 20 21 22 23 24
    //
    // Monday 19th is the state funeral of Queen Elizabeth II, when the venue is
    // closed for a bank holiday.  The library should be open as normal on
    // Sunday 18th and Tuesday 20th.
    describe('handling exceptional closure for a bank holiday', () => {
      const galleryDuringStateFuneral: Venue = {
        id: 'Wsttgx8AAJeSNmJ4',
        order: 1,
        name: 'Galleries and Reading Room',
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
              overrideDate: new Date('2022-09-18T23:00:00.000Z'),
              overrideType: 'Bank holiday',
              opens: '00:00',
              closes: '00:00',
              isClosed: true,
            },
          ],
        },
      };

      it('says we’re open on Sunday', () => {
        const spyOnToday = jest.spyOn(dateUtils, 'today');

        spyOnToday.mockImplementation(() => {
          return new Date('2022-09-18T12:00:00+0100');
        });

        const result = getTodaysVenueHours(galleryDuringStateFuneral);
        expect(result).toEqual({
          dayOfWeek: 'Sunday',
          opens: '10:00',
          closes: '18:00',
          isClosed: false,
        });
      });

      it('says we’re closed on Monday', () => {
        const spyOnToday = jest.spyOn(dateUtils, 'today');

        spyOnToday.mockImplementation(() => {
          return new Date('2022-09-19T12:00:00+0100');
        });

        const result = getTodaysVenueHours(galleryDuringStateFuneral);
        expect(result).toEqual({
          overrideDate: new Date('2022-09-18T23:00:00.000Z'),
          overrideType: 'Bank holiday',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        });
      });

      it('says we’re open on Tuesday', () => {
        const spyOnToday = jest.spyOn(dateUtils, 'today');

        spyOnToday.mockImplementation(() => {
          return new Date('2022-09-20T12:00:00+0100');
        });

        const result = getTodaysVenueHours(galleryDuringStateFuneral);
        expect(result).toEqual({
          dayOfWeek: 'Tuesday',
          opens: '10:00',
          closes: '18:00',
          isClosed: false,
        });
      });
    });
  });

  describe('groupConsecutiveExceptionalDays', () => {
    it('puts consecutive exceptional dates into groups', () => {
      const result = groupConsecutiveExceptionalDays([
        {
          overrideDate: new Date('2022-01-01'),
          overrideType: 'Christmas and New Year',
          opens: '12:00',
          closes: '14:00',
          isClosed: false,
        },
        {
          overrideDate: new Date('2021-12-31'),
          overrideType: 'Christmas and New Year',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2022-02-05'),
          overrideType: 'Bank holiday',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2021-12-30'),
          overrideType: 'Christmas and New Year',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2021-12-29'),
          overrideType: 'Christmas and New Year',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
        {
          overrideDate: new Date('2022-02-04'),
          overrideType: 'Bank holiday',
          opens: '00:00',
          closes: '00:00',
          isClosed: true,
        },
      ]);

      expect(result).toEqual([
        [
          {
            overrideDate: new Date('2021-12-29'),
            overrideType: 'Christmas and New Year',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            overrideDate: new Date('2021-12-30'),
            overrideType: 'Christmas and New Year',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            overrideDate: new Date('2021-12-31'),
            overrideType: 'Christmas and New Year',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            overrideDate: new Date('2022-01-01'),
            overrideType: 'Christmas and New Year',
            opens: '12:00',
            closes: '14:00',
            isClosed: false,
          },
        ],
        [
          {
            overrideDate: new Date('2022-02-04'),
            overrideType: 'Bank holiday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
          {
            overrideDate: new Date('2022-02-05'),
            overrideType: 'Bank holiday',
            opens: '00:00',
            closes: '00:00',
            isClosed: true,
          },
        ],
      ]);
    });
  });
});
