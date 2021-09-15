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
} from '../../utils/format-date';

describe('date formatting utilities', () => {
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
      const previousTime = new Date();
      previousTime.setHours(previousTime.getHours() - 1);

      expect(isTimePast(previousTime)).toBe(true);
    });
    it('returns false for a date/time after now', () => {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 1);

      expect(isTimePast(futureTime)).toBe(false);
    });
  });

  describe('isDatePast', () => {
    it('returns true for a day before now', () => {
      const previousDate = new Date();
      previousDate.setDate(previousDate.getDate() - 1);

      expect(isDatePast(previousDate)).toBe(true);
    });
    it('returns false for a time before now but on the same day', () => {
      const previousDate = new Date();
      // Yes, this will fail if run in the second after midnight
      previousDate.setSeconds(previousDate.getSeconds() - 1);

      expect(isDatePast(previousDate)).toBe(false);
    });
    it('returns false for a day after now', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      expect(isDatePast(futureDate)).toBe(false);
    });
  });

  describe('formatDateRangeWithMessage', () => {
    it('returns "Coming soon" for a start date on a day in the future', () => {
      const start = new Date();
      start.setDate(start.getDate() + 5);
      const end = new Date();
      end.setDate(start.getDate() + 60);

      expect(formatDateRangeWithMessage({ start, end }).text).toBe(
        'Coming soon'
      );
    });
    it('returns "Past" for an end date on a day in the past', () => {
      const start = new Date();
      start.setDate(start.getDate() - 65);
      const end = new Date();
      end.setDate(end.getDate() - 5);

      expect(formatDateRangeWithMessage({ start, end }).text).toBe('Past');
    });
    it('returns "Final week" when the end date is less than a week in the future', () => {
      const start = new Date();
      start.setDate(start.getDate() - 7);
      const end = new Date();
      end.setDate(end.getDate() + 5);

      expect(formatDateRangeWithMessage({ start, end }).text).toBe(
        'Final week'
      );
    });
    it('returns "Now on" when between the start and end date but not in the final week', () => {
      const start = new Date();
      start.setDate(start.getDate() - 7);
      const end = new Date();
      end.setDate(end.getDate() + 60);

      expect(formatDateRangeWithMessage({ start, end }).text).toBe('Now on');
    });
  });
});
