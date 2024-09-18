import timezoneMock from 'timezone-mock';

import {
  formatDate,
  formatDayDate,
  formatDayMonth,
  formatDayName,
  formatDuration,
  formatIso8601Date,
  formatTime,
  formatYear,
} from './format-date';

it('formats a day', () => {
  const result = formatDayName(new Date('2001-01-01'));

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

  // Note: this is 11:28 UTC; we're checking that formatTime is using
  // London time.
  const result4 = formatTime(new Date('2022-09-29T12:28:33+0100'));
  expect(result4).toEqual('12:28');
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

describe('formatIso8601Date', () => {
  test.each([
    { date: new Date('1 February 2003'), formattedDate: '2003-02-01' },
    { date: new Date('17 December 2021'), formattedDate: '2021-12-17' },
  ])(
    '$date seconds is formatted as $formattedDate',
    ({ date, formattedDate }) => {
      expect(formatIso8601Date(date)).toStrictEqual(formattedDate);
    }
  );
});

describe('formats times as they are in London, regardless of user locale', () => {
  // The tests will run with whatever the local timezone is, which is usually going to
  // be London (on dev machines) or UTC (in CI).
  //
  // These tests run with an explicit timezone, to catch bugs that occur when running
  // outside the usual timezones we test in.  They use beforeEach() / afterEach() to avoid
  // polluting the state of the other tests.
  //
  // The time is 6pm in San Francisco, which becomes 2am in London.
  // We want to check the dates are formatted as they are in London.
  //
  // See https://www.npmjs.com/package/timezone-mock

  beforeEach(() => {
    timezoneMock.register('US/Pacific');
  });

  afterEach(() => {
    timezoneMock.unregister();
  });

  test.each([
    {
      formatFunction: formatDayName,
      date: '2023-01-06T18:00:00-0800',
      output: 'Saturday',
    },
    {
      formatFunction: formatDayDate,
      date: '2023-01-06T18:00:00-0800',
      output: 'Saturday 7 January 2023',
    },
    {
      formatFunction: formatDate,
      date: '2023-01-06T18:00:00-0800',
      output: '7 January 2023',
    },
    {
      formatFunction: formatTime,
      date: '2023-01-06T18:00:00-0800',
      output: '02:00',
    },
    {
      formatFunction: formatYear,
      date: '2022-12-31T18:00:00-0800',
      output: '2023',
    },
  ])(
    '$formatFunction($date) should be $output',
    ({ formatFunction, date, output }) => {
      const result = formatFunction(new Date(date));
      expect(result).toBe(output);
    }
  );
});
