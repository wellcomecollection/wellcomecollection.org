import {
  formatDate,
  formatDateRangeWithMessage,
  formatDay,
  formatDayDate,
  formatDayMonth,
  formatDuration,
  formatTime,
  formatYear,
} from './format-date';

it('formats a day', () => {
  const result = formatDay(new Date('2001-01-01'));

  expect(result).toEqual('Monday');
});

it('formats a day with a date', () => {
  const result = formatDayDate(new Date('2001-02-03'));

  expect(result).toEqual('Saturday 3 February 2001');
});

it('formats a date', () => {
  const result = formatDate(new Date('2009-03-27'));

  expect(result).toEqual('27 March 2009');
});

it('formats a timestamp', () => {
  const result1 = formatTime(new Date('2009-03-27T17:21:01Z'));
  expect(result1).toEqual('17:21');

  const result2 = formatTime(new Date('2009-03-27T09:41:01Z'));
  expect(result2).toEqual('09:41');
});

it('formats a year', () => {
  const result = formatYear(new Date('2009-03-27T01:01:01Z'));

  expect(result).toEqual('2009');
});

it('formats a day and a month', () => {
  const result1 = formatDayMonth(new Date(2009, 3, 27, 1, 1, 1));
  expect(result1).toEqual('27 April');

  const result2 = formatDayMonth(new Date(2021, 4, 6, 1, 1, 1));
  expect(result2).toEqual('6 May');
});

describe('formatDateRangeWithMessage', () => {
  it('formats a range that hasn’t started yet', () => {
    const result = formatDateRangeWithMessage({
      start: new Date(2101, 1, 1),
      end: new Date(2101, 2, 1),
    });

    expect(result).toEqual({ text: 'Coming soon', color: 'marble' });
  });

  describe('formats an event that is past', () => {
    it('says "Past" if the last day was years ago', () => {
      const result = formatDateRangeWithMessage({
        start: new Date(1999, 1, 1),
        end: new Date(1999, 2, 1),
      });

      expect(result).toEqual({ text: 'Past', color: 'marble' });
    });

    it('says "Past" if the last day was yesterday', () => {
      const end = new Date();
      end.setDate(end.getDate() - 1);
      const yesterday = new Date(end);

      const result = formatDateRangeWithMessage({
        start: new Date(1999, 1, 1),
        end: yesterday,
      });

      expect(result).toEqual({ text: 'Past', color: 'marble' });
    });

    it('does not say "Past" if the last day is today', () => {
      const today = new Date();
      today.setHours(1);

      const result = formatDateRangeWithMessage({
        start: new Date(1999, 1, 1),
        end: today,
      });

      expect(result).not.toEqual({ text: 'Past', color: 'marble' });
    });
  });

  describe('formats an event in its final week', () => {
    it('says "Final week" if the last day is today', () => {
      const today = new Date();

      const result = formatDateRangeWithMessage({
        start: new Date(1999, 1, 1),
        end: today,
      });

      expect(result).toEqual({ text: 'Final week', color: 'orange' });
    });

    it('says "Final week" if the last day is tomorrow', () => {
      const end = new Date();
      end.setDate(end.getDate() + 1);
      const tomorrow = new Date(end);

      const result = formatDateRangeWithMessage({
        start: new Date(1999, 1, 1),
        end: tomorrow,
      });

      expect(result).toEqual({ text: 'Final week', color: 'orange' });
    });

    it('says "Final week" if the last day is 6 days away', () => {
      const end = new Date();
      end.setDate(end.getDate() + 6);

      const result = formatDateRangeWithMessage({
        start: new Date(1999, 1, 1),
        end,
      });

      expect(result).toEqual({ text: 'Final week', color: 'orange' });
    });

    it('says "Now on" if the last day is 7 or more days away', () => {
      const end = new Date();
      end.setDate(end.getDate() + 7);

      const result = formatDateRangeWithMessage({
        start: new Date(1999, 1, 1),
        end,
      });

      expect(result).toEqual({ text: 'Now on', color: 'green' });
    });
  });

  it('says "Now on" for an event that opened today', () => {
    const result = formatDateRangeWithMessage({
      start: new Date(),
      end: new Date(2101, 2, 1),
    });

    expect(result).toEqual({ text: 'Now on', color: 'green' });
  });

  it('says "Now on" for a currently running event', () => {
    const result = formatDateRangeWithMessage({
      start: new Date(1999, 1, 1),
      end: new Date(2101, 2, 1),
    });

    expect(result).toEqual({ text: 'Now on', color: 'green' });
  });
});

describe('formatDuration', () => {
  test.each([
    { seconds: 1, formattedDuration: '00:00:01' },
    { seconds: 59, formattedDuration: '00:00:59' },
    { seconds: 60 * 12, formattedDuration: '00:12:00' },
    { seconds: 60 * 83 + 13, formattedDuration: '01:23:13' },
  ])(
    '$seconds seconds is formatted as $formattedDuration',
    ({ seconds, formattedDuration }) => {
      expect(formatDuration(seconds)).toStrictEqual(formattedDuration);
    }
  );
});
