import each from 'jest-each';
import {
  countDaysBetween,
  endOfWeek,
  getDatesBetween,
  getNextWeekendDateRange,
  isFuture,
  isPast,
  isSameDay,
  isSameDayOrBefore,
  isSameMonth,
  minDate,
  maxDate,
  startOfWeek,
  startOfDay,
  endOfDay,
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

  describe('ComparisonMode', () => {
    const september19Midnight = new Date(
      // = Sep 18 2022 23:00:00 UTC
      'Mon Sep 19 2022 00:00:00 GMT+0100 (British Summer Time)'
    );
    const september18TwentyThreeThirty = new Date(
      // = Sep 18 2022 22:30:00 UTC
      'Sun Sep 18 2022 23:30:00 GMT+0100 (British Summer Time)'
    );
    const september19MidnightThirty = new Date(
      // = Sep 18 2022 23:30:00 UTC
      'Mon Sep 19 2022 00:30:00 GMT+0100 (British Summer Time)'
    );
    const september19Midday = new Date(
      // = Sep 19 2022 11:00:00 UTC
      'Mon Sep 19 2022 12:00:00 GMT+0100 (British Summer Time)'
    );

    it('says midnight {x} BST in London is on the same day as midday {x} BST using a comparison mode of "London"', () => {
      const result = isSameDay(
        september19Midnight,
        september19Midday,
        'London'
      );
      expect(result).toEqual(true);
    });

    it('says midnight {x} BST in London is not on the same day as midday {x} BST using a comparison mode of "UTC"', () => {
      const result = isSameDay(september19Midnight, september19Midday, 'UTC');
      expect(result).toEqual(false);
    });

    it('says 23:30 {x} BST in London is not on the same day as 00:30 {x+1} BST using a comparison mode of "London"', () => {
      const result = isSameDay(
        september18TwentyThreeThirty,
        september19MidnightThirty,
        'London'
      );
      expect(result).toEqual(false);
    });

    it('says 23:30 {x} BST in London is on the same day as 00:30 {x+1} BST using a comparison mode of "UTC"', () => {
      const result = isSameDay(
        september18TwentyThreeThirty,
        september19MidnightThirty,
        'UTC'
      );
      expect(result).toEqual(true);
    });
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

  it('says two times on the same day in London are the same, even if they’re different UTC days', () => {
    const date1 = new Date(
      // =    -01T23:30:00 UTC
      '2002-09-02T00:30:00+0100'
    );
    const date2 = new Date(
      // =    -02T00:30:00 UTC
      '2002-09-02T01:30:00+0100'
    );

    expect(isSameDayOrBefore(date1, date2)).toEqual(true);
    expect(isSameDayOrBefore(date2, date1)).toEqual(true);
  });

  it('knows how dates on different days in London are ordered, even if they’re the same UTC day', () => {
    const date1 = new Date(
      // =    -01T22:30:00 UTC
      '2002-09-01T23:30:00+0100'
    );
    const date2 = new Date(
      // =    -01T23:30:00 UTC
      '2002-09-02T00:30:00+0100'
    );

    expect(isSameDayOrBefore(date1, date2)).toEqual(true);
    expect(isSameDayOrBefore(date2, date1)).toEqual(false);
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

    expect(isSameDay(range.start, weekend.start, 'London')).toBeTruthy();
    console.log(
      `@@AWLC range = ${JSON.stringify(range)}, weekend = ${JSON.stringify(
        weekend
      )}`
    );
    expect(isSameDay(range.end, weekend.end, 'London')).toBeTruthy();
  });
});

describe('getDatesBetween', () => {
  it('finds the dates between two other dates', () => {
    const result = getDatesBetween({
      startDate: new Date('2001-01-01T00:00:00Z'),
      endDate: new Date('2001-01-04T00:00:00Z'),
    });

    expect(result).toStrictEqual([
      new Date('2001-01-01T00:00:00Z'),
      new Date('2001-01-02T00:00:00Z'),
      new Date('2001-01-03T00:00:00Z'),
      new Date('2001-01-04T00:00:00Z'),
    ]);
  });
});

describe('countDaysBetween', () => {
  test.each([
    {
      x: new Date('2022-09-05'),
      y: new Date('2022-09-05'),
      daysBetween: 0,
    },
    {
      x: new Date('2022-09-05'),
      y: new Date('2022-09-06'),
      daysBetween: -1,
    },
    {
      x: new Date('2022-09-05'),
      y: new Date('2022-09-30'),
      daysBetween: -25,
    },
    {
      x: new Date('2022-09-05'),
      y: new Date('2022-10-30'),
      daysBetween: -55,
    },
    {
      x: new Date('2022-09-05'),
      y: new Date('2023-10-28'),
      daysBetween: -418,
    },
  ])(
    'there are $daysBetween days between $x and $y',
    ({ x, y, daysBetween }) => {
      const result = countDaysBetween(x, y);
      expect(result).toBe(daysBetween);
    }
  );
});

describe('minDate and maxDate', () => {
  const date1 = new Date('2001-01-01T01:01:01Z');
  const date2 = new Date('2002-02-02T02:02:02Z');
  const date3 = new Date('2003-03-03T03:03:03Z');

  // We test in a bunch of combinations, in particular putting the
  // min/max date in varying positions so we know the functions don't
  // rely on the input order.
  const combinations = [
    { dates: [date1, date2, date3] },
    { dates: [date2, date3, date1] },
    { dates: [date3, date1, date2] },
  ];

  test.each(combinations)(
    `the min date from ${combinations} is ${date1}`,
    ({ dates }) => {
      expect(minDate(dates)).toBe(date1);
    }
  );

  test.each(combinations)(
    `the max date from ${combinations} is ${date1}`,
    ({ dates }) => {
      expect(maxDate(dates)).toBe(date3);
    }
  );
});

describe('startOfDay and endOfDay', () => {
  const combinations = [
    // when British Summer Time is in effect, and London is offset from UTC
    {
      d: new Date('2023-04-24'),
      startDate: new Date('2023-04-23T23:00:00Z'),
      endDate: new Date('2023-04-24T22:59:59.999Z'),
    },
    // when British Summer Time is not in effect, and London is on UTC
    {
      d: new Date('2023-11-24'),
      startDate: new Date('2023-11-24T00:00:00Z'),
      endDate: new Date('2023-11-24T23:59:59.999Z'),
    },
  ];

  test.each(combinations)(
    'the start of $d is $startDate',
    ({ d, startDate }) => {
      expect(startOfDay(d)).toStrictEqual(startDate);
    }
  );

  test.each(combinations)('the end of $d is $endDate', ({ d, endDate }) => {
    expect(endOfDay(d)).toStrictEqual(endDate);
  });
});
