import { formatDateRangeWithMessage } from './StatusIndicator';

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

  describe('formats an event in its final week', () => {
    it('says "Final week" if the last day is today', () => {
      const today = new Date();

      const result = formatDateRangeWithMessage({
        start: new Date(1999, 1, 1),
        end: today,
      });

      expect(result).toEqual({ text: 'Final week', color: 'accent.salmon' });
    });

    it('says "Final week" if the last day is tomorrow', () => {
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
});
