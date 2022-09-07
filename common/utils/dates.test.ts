import each from 'jest-each';
import {
  dayBefore,
  getDatesBetween,
  getNextWeekendDateRange,
  isFuture,
  isPast,
  isSameDay,
  isSameDayOrBefore,
  isSameMonth,
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

describe('isSameDayOrBefore', () => {
  it('says a day is the same or before itself', () => {
    const day = new Date('2001-01-01');
    const result = isSameDayOrBefore(day, day);

    expect(result).toEqual(true);
  });

  it('says two times on the same day are the same', () => {
    const date1 = new Date('2001-01-01T12:00:00Z');
    const date2 = new Date('2001-01-01T18:00:00Z');

    expect(isSameDayOrBefore(date1, date2)).toEqual(true);
    expect(isSameDayOrBefore(date2, date1)).toEqual(true);
  });

  it('knows how dates on different days are ordered', () => {
    const date1 = new Date('2001-01-01T01:01:01Z');
    const date2 = new Date('2002-02-02T02:02:02Z');

    expect(isSameDayOrBefore(date1, date2)).toEqual(true);
    expect(isSameDayOrBefore(date2, date1)).toEqual(false);
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

describe('getNextWeekendDateRange', () => {
  test.each([
    // Monday
    {
      day: new Date('2022-09-05'),
      weekend: { start: new Date('2022-09-09'), end: new Date('2022-09-11') },
    },
    // Friday
    {
      day: new Date('2022-09-02'),
      weekend: { start: new Date('2022-09-02'), end: new Date('2022-09-04') },
    },
    // Saturday
    {
      day: new Date('2022-09-03'),
      weekend: { start: new Date('2022-09-02'), end: new Date('2022-09-04') },
    },
    // Sunday
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

describe('getDatesBetween', () => {
  it('finds the dates between two other dates', () => {
    const result = getDatesBetween({
      start: new Date('2001-01-01T00:00:00Z'),
      end: new Date('2001-01-04T00:00:00Z'),
    });

    expect(result).toStrictEqual([
      new Date('2001-01-01T00:00:00Z'),
      new Date('2001-01-02T00:00:00Z'),
      new Date('2001-01-03T00:00:00Z'),
      new Date('2001-01-04T00:00:00Z'),
    ]);
  });
});
