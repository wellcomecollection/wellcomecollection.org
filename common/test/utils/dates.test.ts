import moment from 'moment';
import {
  london,
  formatDay,
  formatDayDate,
  formatDayMonth,
  formatDate,
  formatTime,
  isTimePast,
  isDatePast,
  formatDateRangeWithMessage,
  getEarliestFutureDateRange,
  getNextWeekendDateRange,
  formatDateForApi,
} from '../../utils/dates';

const offsetDate = (
  offset: { days?: number; hours?: number; seconds?: number },
  original: Date = new Date()
): Date => {
  const newDate = new Date(original.valueOf());
  newDate.setSeconds(original.getSeconds() + (offset.seconds || 0));
  newDate.setHours(original.getHours() + (offset.hours || 0));
  newDate.setDate(original.getDate() + (offset.days || 0));
  return newDate;
};

describe('date utilities', () => {
  // Month is 0-indexed; this is 2021/9/15 at 16:20:31
  const testDate = new Date(2021, 8, 15, 16, 20, 31);

  describe('london', () => {
    it('returns a non-London date in the London time zone', () => {
      const newYorkDate = moment().tz('America/New_York');
      const londonDate = london(newYorkDate);

      expect(londonDate.zoneName()).toBe(
        moment().tz('Europe/London').zoneName()
      );
    });
    it('returns a London date unmodified', () => {
      const originalDate = moment().tz('Europe/London');
      const londonDate = london(originalDate);

      expect(londonDate).toEqual(originalDate);
    });
  });

  describe('formatDay', () => {
    it('returns the full day string', () => {
      expect(formatDay(testDate)).toBe('Wednesday');
    });
  });

  describe('formatDayDate', () => {
    it('returns the full day, date, month and year', () => {
      expect(formatDayDate(testDate)).toBe('Wednesday 15 September 2021');
    });
  });

  describe('formatDayMonth', () => {
    it('returns the date and full month', () => {
      expect(formatDayMonth(testDate)).toBe('15 September');
    });
  });

  describe('formatDate', () => {
    it('returns the date, month and year', () => {
      expect(formatDate(testDate)).toBe('15 September 2021');
    });
  });

  describe('formatTime', () => {
    it('returns the time in 24hr format', () => {
      expect(formatTime(testDate)).toBe('16:20');
    });
  });

  describe('isTimePast', () => {
    it('returns true for a date/time before now', () => {
      const previousTime = offsetDate({ hours: -1 });

      expect(isTimePast(previousTime)).toBe(true);
    });
    it('returns false for a date/time after now', () => {
      const futureTime = offsetDate({ hours: 1 });

      expect(isTimePast(futureTime)).toBe(false);
    });
  });

  describe('isDatePast', () => {
    it('returns true for a day before now', () => {
      const previousDate = offsetDate({ days: -1 });

      expect(isDatePast(previousDate)).toBe(true);
    });
    it('returns false for a time before now but on the same day', () => {
      // Yes, this will fail if run in the second after midnight
      const previousDate = offsetDate({ seconds: -1 });

      expect(isDatePast(previousDate)).toBe(false);
    });
    it('returns false for a day after now', () => {
      const futureDate = offsetDate({ days: 1 });

      expect(isDatePast(futureDate)).toBe(false);
    });
  });

  describe('formatDateRangeWithMessage', () => {
    it('returns "Coming soon" for a start date on a day in the future', () => {
      const start = offsetDate({ days: 5 });
      const end = offsetDate({ days: 60 });

      expect(formatDateRangeWithMessage({ start, end }).text).toBe(
        'Coming soon'
      );
    });
    it('returns "Past" for an end date on a day in the past', () => {
      const start = offsetDate({ days: -65 });
      const end = offsetDate({ days: -5 });

      expect(formatDateRangeWithMessage({ start, end }).text).toBe('Past');
    });
    it('returns "Final week" when the end date is less than a week in the future', () => {
      const start = offsetDate({ days: -7 });
      const end = offsetDate({ days: 5 });

      expect(formatDateRangeWithMessage({ start, end }).text).toBe(
        'Final week'
      );
    });
    it('returns "Now on" when between the start and end date but not in the final week', () => {
      const start = offsetDate({ days: -7 });
      const end = offsetDate({ days: 60 });

      expect(formatDateRangeWithMessage({ start, end }).text).toBe('Now on');
    });
  });

  describe('getEarliestFutureDateRange', () => {
    const pastDateRange = {
      start: offsetDate({ days: -10 }),
      end: offsetDate({ days: -5 }),
    };
    const currentDateRange = {
      start: offsetDate({ days: -5 }),
      end: offsetDate({ days: 5 }),
    };
    const futureDateRange = {
      start: offsetDate({ days: 5 }),
      end: offsetDate({ days: 10 }),
    };
    const furtherFutureDateRange = {
      start: offsetDate({ days: 10 }),
      end: offsetDate({ days: 15 }),
    };
    const dateRanges = [
      pastDateRange,
      currentDateRange,
      futureDateRange,
      furtherFutureDateRange,
    ];

    it('selects the earliest date range ending in the future from a list', () => {
      expect(getEarliestFutureDateRange(dateRanges)).toEqual(currentDateRange);
    });
    it('selects the earliest date range ending in the future after a given date from a list', () => {
      expect(
        getEarliestFutureDateRange(
          dateRanges,
          moment(offsetDate({ days: 1 }, currentDateRange.end))
        )
      ).toEqual(futureDateRange);
    });
  });

  describe('getNextWeekendDateRange', () => {
    // This includes the friday - why?

    it('Returns the date range spanning the weekend following a given weekday date', () => {
      const thursday = new Date('2021-09-16');
      const result = getNextWeekendDateRange(thursday);

      expect(result.start.getDay()).toBe(5); // Friday
      expect(result.end.getDay()).toBe(0); // Sunday

      expect(result.end.valueOf()).toBeGreaterThan(result.start.valueOf());
      expect(result.start.valueOf()).toBeGreaterThan(thursday.valueOf());
      // Nearest weekend
      expect(result.start.valueOf() - thursday.valueOf()).toBeLessThan(
        1000 * 60 * 60 * 24 * 2
      );
    });
    it('Returns the date range spanning the weekend of a given weekend date', () => {
      const sunday = new Date('2021-09-19');
      const result = getNextWeekendDateRange(sunday);

      expect(result.start.getDay()).toBe(5); // Friday
      expect(result.end.getDay()).toBe(0); // Sunday

      expect(result.end.valueOf()).toBeGreaterThan(result.start.valueOf());
      expect(result.start.valueOf()).toBeLessThan(sunday.valueOf());
    });
  });

  describe('formatDateForApi', () => {
    it('returns a date in YYYY-MM-DD format when given a valid year', () => {
      expect(formatDateForApi('1955')).toBe('1955-01-01');
    });
    it('returns undefined when given invalid input', () => {
      expect(formatDateForApi('not a real date')).toBeUndefined();
    });
  });
});
