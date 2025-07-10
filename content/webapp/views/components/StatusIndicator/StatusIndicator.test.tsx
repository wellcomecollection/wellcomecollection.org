import mockToday from '@weco/common/test/utils/date-mocks';

import { formatDateRangeWithMessage } from '.';

describe('formatDateRangeWithMessage', () => {
  it('formats a range that hasn’t started yet', () => {
    const result = formatDateRangeWithMessage({
      start: new Date(2101, 1, 1),
      end: new Date(2101, 2, 1),
    });

    expect(result).toEqual({ text: 'Coming soon', color: 'neutral.500' });
  });

  describe('formats an event that is past', () => {
    it('says "Past" if the last day was years ago', () => {
      const result = formatDateRangeWithMessage({
        start: new Date(1999, 1, 1),
        end: new Date(1999, 2, 1),
      });

      expect(result).toEqual({ text: 'Past', color: 'neutral.500' });
    });

    it('says "Past" if the last day was yesterday', () => {
      const end = new Date();
      end.setDate(end.getDate() - 1);
      const yesterday = new Date(end);

      const result = formatDateRangeWithMessage({
        start: new Date(1999, 1, 1),
        end: yesterday,
      });

      expect(result).toEqual({ text: 'Past', color: 'neutral.500' });
    });

    it('does not say "Past" if the last day is today', () => {
      const today = new Date();
      today.setHours(1);

      const result = formatDateRangeWithMessage({
        start: new Date(1999, 1, 1),
        end: today,
      });

      expect(result).not.toEqual({ text: 'Past', color: 'neutral.500' });
    });
  });

  describe('formats an event that is close to ending', () => {
    it('says "Final week" if the last day is today', () => {
      const today = new Date();

      const result = formatDateRangeWithMessage({
        start: new Date(1999, 1, 1),
        end: today,
      });

      expect(result).toEqual({ text: 'Final week', color: 'accent.salmon' });
    });

    it('says "Final week" if the last day is today in London, if not UTC', () => {
      // These are the dates for the "In the Air" exhibition, as entered
      // in Prismic.  The first day the public could see it was on
      // Thursday 19 May, and the last day is Sunday 16 October.
      //
      // Somebody looking at the website on noon on Sunday should see it as
      // still open.
      mockToday({ as: new Date('2022-10-16T12:00:00.000+0100') });

      const inTheAir = {
        start: new Date('2022-05-19T00:00:00.000+0100'),
        end: new Date('2022-10-16T00:00:00.000+0100'),
      };

      const result = formatDateRangeWithMessage(inTheAir);

      expect(result).toEqual({ text: 'Final week', color: 'accent.salmon' });
    });

    it('says "Final week" if the last day is tomorrow', () => {
      mockToday({ as: new Date() });

      const end = new Date();
      end.setDate(end.getDate() + 1);
      const tomorrow = new Date(end);

      const result = formatDateRangeWithMessage({
        start: new Date(1999, 1, 1),
        end: tomorrow,
      });

      expect(result).toEqual({ text: 'Final week', color: 'accent.salmon' });
    });

    it('says "Final week" if the last day is 6 days away', () => {
      const end = new Date();
      end.setDate(end.getDate() + 6);

      const result = formatDateRangeWithMessage({
        start: new Date(1999, 1, 1),
        end,
      });

      expect(result).toEqual({ text: 'Final week', color: 'accent.salmon' });
    });

    it('says "Now on" if the last day is 7 or more days away', () => {
      const end = new Date();
      end.setDate(end.getDate() + 7);

      const result = formatDateRangeWithMessage({
        start: new Date(1999, 1, 1),
        end,
      });

      expect(result).toEqual({ text: 'Now on', color: 'validation.green' });
    });
  });

  it('says "Now on" for an event that opened today', () => {
    const result = formatDateRangeWithMessage({
      start: new Date(),
      end: new Date(2101, 2, 1),
    });

    expect(result).toEqual({ text: 'Now on', color: 'validation.green' });
  });

  it('says "Now on" for a currently running event', () => {
    const result = formatDateRangeWithMessage({
      start: new Date(1999, 1, 1),
      end: new Date(2101, 2, 1),
    });

    expect(result).toEqual({ text: 'Now on', color: 'validation.green' });
  });

  it('says "Coming soon" if the first day is today in UTC, but not in London', () => {
    // These are the dates for the "In the Air" exhibition, as entered
    // in Prismic.  The first day the public could see it was on
    // Thursday 19 May, and the last day is Sunday 16 October.
    //
    // Somebody looking at the website on noon on Wednesday should see it
    // as not yet open.
    const wednesday = new Date('2022-05-18T12:00:00.000+0100');

    mockToday({ as: wednesday });

    const inTheAir = {
      start: new Date('2022-05-19T00:00:00.000+0100'),
      end: new Date('2022-10-16T00:00:00.000+0100'),
    };

    const result = formatDateRangeWithMessage(inTheAir);

    expect(result).toEqual({ text: 'Coming soon', color: 'neutral.500' });
  });
});
