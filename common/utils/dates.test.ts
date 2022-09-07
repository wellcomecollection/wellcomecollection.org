import each from 'jest-each';
import {
  dayBefore,
  endOfWeek,
  getNextWeekendDateRange,
  isFuture,
  isPast,
  isSameDay,
  isSameMonth,
  startOfWeek,
} from './dates';

it('identifies dates in the past', () => {
  expect(isPast(new Date(2001, 1, 1, 1, 1, 1, 999))).toEqual(true);
});

it('identifies dates in the future', () => {
  expect(isFuture(new Date(3000, 1, 1, 1, 1, 1, 1))).toEqual(true);
});

describe('isSameDay', () => {
  it('says a day is the same as itself', () => {
    const day = new Date(2001, 1, 1, 1, 1, 1);
    const result = isSameDay(day, day);

    expect(result).toEqual(true);
  });

  it('says two times on the same day are the same', () => {
    const result = isSameDay(
      new Date(2001, 1, 1, 1, 1, 1),
      new Date(2001, 1, 1, 13, 24, 37)
    );

    expect(result).toEqual(true);
  });

  each([
    // same day of the week as returned by Date.getDay()
    [new Date(2001, 2, 3, 1, 1, 1), new Date(2001, 2, 10, 1, 1, 1)],

    // same year/month, different day
    [new Date(2001, 2, 3, 1, 1, 1), new Date(2001, 2, 10, 1, 1, 1)],

    // same year/day, different month
    [new Date(2001, 2, 3, 1, 1, 1), new Date(2001, 10, 3, 1, 1, 1)],

    // same month/day, different year
    [new Date(2001, 2, 3, 1, 1, 1), new Date(2022, 2, 3, 1, 1, 1)],

    // completely different days
    [new Date(2001, 2, 3, 1, 1, 1), new Date(2022, 5, 7, 19, 11, 13)],
  ]).test('identifies %s and %s as different', (a, b) => {
    const result = isSameDay(a, b);
    expect(result).toEqual(false);
  });
});

describe('isSameMonth', () => {
  it('says a day is the same as itself', () => {
    const day = new Date(2001, 1, 1, 1, 1, 1);
    const result = isSameMonth(day, day);

    expect(result).toEqual(true);
  });

  it('says two times on the same day are the same', () => {
    const result = isSameMonth(
      new Date(2001, 1, 1, 1, 1, 1),
      new Date(2001, 1, 1, 13, 24, 37)
    );

    expect(result).toEqual(true);
  });

  it('says two days in the same month are the same', () => {
    const result = isSameMonth(
      new Date(2001, 1, 1, 1, 1, 1),
      new Date(2001, 1, 13, 4, 21, 53)
    );

    expect(result).toEqual(true);
  });

  each([
    // same year/day, different month
    [new Date(2001, 2, 1, 1, 1, 1), new Date(2001, 3, 1, 1, 1, 1)],

    // same month of year, different year
    [new Date(2001, 2, 1, 1, 1, 1), new Date(2005, 2, 1, 1, 1, 1)],

    // completely different months
    [new Date(2001, 2, 3, 1, 1, 1), new Date(2022, 5, 7, 19, 11, 13)],
  ]).test('identifies %s and %s as different', (a, b) => {
    const result = isSameMonth(a, b);
    expect(result).toEqual(false);
  });
});

describe('dayBefore', () => {
  test.each([
    { day: new Date('2022-09-02'), prevDay: new Date('2022-09-01') },
    { day: new Date('2022-09-01'), prevDay: new Date('2022-08-31') },
    { day: new Date('2022-01-01'), prevDay: new Date('2021-12-31') },
  ])('the day before $day is $prevDay', ({ day, prevDay }) => {
    expect(dayBefore(day)).toStrictEqual(prevDay);
  });
});

//
//    September 2022
// Su Mo Tu We Th Fr Sa
//              1  2  3
//  4  5  6  7  8  9 10
// 11 12 13 14 15 16 17
// 18 19 20 21 22 23 24
//
describe('startOfWeek and endOfWeek', () => {
  test.each([
    { day: new Date('2022-09-09'), expectedStart: new Date('2022-09-04') },
    { day: new Date('2022-09-10'), expectedStart: new Date('2022-09-04') },
    { day: new Date('2022-09-11'), expectedStart: new Date('2022-09-11') },
  ])(
    'the week containing $day starts on $expectedStart',
    ({ day, expectedStart }) => {
      expect(isSameDay(startOfWeek(day), expectedStart)).toBeTruthy();
    }
  );

  test.each([
    { day: new Date('2022-09-09'), expectedEnd: new Date('2022-09-10') },
    { day: new Date('2022-09-10'), expectedEnd: new Date('2022-09-10') },
    { day: new Date('2022-09-11'), expectedEnd: new Date('2022-09-17') },
  ])(
    'the week containing $day ends on $expectedEnd',
    ({ day, expectedEnd }) => {
      expect(isSameDay(endOfWeek(day), expectedEnd)).toBeTruthy();
    }
  );
});

//
//    September 2022
// Su Mo Tu We Th Fr Sa
//              1  2  3
//  4  5  6  7  8  9 10
// 11 12 13 14 15 16 17
// 18 19 20 21 22 23 24
//
describe('getNextWeekendDateRange', () => {
  test.each([
    {
      day: new Date('2022-09-05'),
      weekend: { start: new Date('2022-09-09'), end: new Date('2022-09-11') },
    },
    {
      day: new Date('2022-09-02'),
      weekend: { start: new Date('2022-09-02'), end: new Date('2022-09-04') },
    },
    {
      day: new Date('2022-09-03'),
      weekend: { start: new Date('2022-09-02'), end: new Date('2022-09-04') },
    },
    {
      day: new Date('2022-09-04'),
      weekend: { start: new Date('2022-09-02'), end: new Date('2022-09-04') },
    },
  ])('the next weekend after $day is $weekend', ({ day, weekend }) => {
    const range = getNextWeekendDateRange(day);
    expect(isSameDay(range.start, weekend.start)).toBeTruthy();
    expect(isSameDay(range.end, weekend.end)).toBeTruthy();
  });
});
