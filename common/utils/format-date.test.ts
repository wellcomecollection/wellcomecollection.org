import {
  formatDate,
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

  const result3 = formatTime(new Date('2009-03-27T08:00:01Z'));
  expect(result3).toEqual('08:00');
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

it('formats dates and timestamps as in London', () => {
  // In September, London is in British Summer Time – clocks are one hour
  // ahead of UTC.
  const autumnDate = new Date('2022-09-06T23:30:00Z');

  expect(formatTime(autumnDate)).toBe('00:30');
  expect(formatDayDate(autumnDate)).toBe('Wednesday 7 September 2022');

  // In March, London is in GMT – clocks match UTC
  const springDate = new Date('2022-03-05T23:30:00Z');

  expect(formatTime(springDate)).toBe('23:30');
  expect(formatDayDate(springDate)).toBe('Saturday 5 March 2022');
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
