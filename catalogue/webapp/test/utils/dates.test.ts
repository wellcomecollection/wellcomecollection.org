import {
  determineNextAvailableDate,
  filterExceptionalClosedDates,
  includedRegularClosedDays,
  groupExceptionalClosedDates,
  extendEndDate,
  findClosedDays,
  findNextPickUpDay,
  isRequestableDate,
} from '../../utils/dates';
import {
  OverrideType,
  OpeningHoursDay,
} from '@weco/common/model/opening-hours';

const exceptionalClosedDates = [
  new Date('2019-12-03'),
  new Date('2019-12-04'),
  new Date('2019-12-05'),
  new Date('2019-12-17'),
  new Date('2019-12-31'),
  new Date('2020-01-06'),
  new Date('2020-01-07'),
  new Date('2020-01-08'),
  new Date('2020-01-09'),
  new Date('2020-01-18'),
  new Date('2020-01-19'),
  new Date('2020-01-20'),
  new Date('2020-01-22'),
];

const regularOpeningHours = [
  {
    dayOfWeek: 'Monday',
    opens: '10:00',
    closes: '18:00',
    isClosed: false,
  },
  {
    dayOfWeek: 'Tuesday',
    opens: '10:00',
    closes: '18:00',
    isClosed: false,
  },
  {
    dayOfWeek: 'Wednesday',
    opens: '10:00',
    closes: '18:00',
    isClosed: false,
  },
  {
    dayOfWeek: 'Thursday',
    opens: '10:00',
    closes: '18:00',
    isClosed: false,
  },
  {
    dayOfWeek: 'Friday',
    opens: '10:00',
    closes: '18:00',
    isClosed: false,
  },
  {
    dayOfWeek: 'Saturday',
    opens: '10:00',
    closes: '16:00',
    isClosed: false,
  },
  {
    dayOfWeek: 'Sunday',
    opens: '00:00',
    closes: '00:00',
    isClosed: true,
  },
] as OpeningHoursDay[];

const exceptionalOpeningHours = [
  {
    overrideDate: new Date('2021-12-25T00:00:00.000Z'),
    overrideType: 'Christmas and New Year' as OverrideType,
    opens: '00:00',
    closes: '00:00',
    isClosed: true,
  },
  {
    overrideDate: new Date('2021-12-26T00:00:00.000Z'),
    overrideType: 'Christmas and New Year' as OverrideType,
    opens: '12:00',
    closes: '14:00',
    isClosed: false,
  },
  {
    overrideDate: new Date('2021-12-27T00:00:00.000Z'),
    overrideType: 'Christmas and New Year' as OverrideType,
    opens: '00:00',
    closes: '00:00',
    isClosed: true,
  },
];

describe('findClosedDays', () => {
  it('filters out any non closed days from regular opening hours', () => {
    const result = findClosedDays(regularOpeningHours);
    expect(result).toEqual([
      { dayOfWeek: 'Sunday', opens: '00:00', closes: '00:00', isClosed: true },
    ]);
  });

  it('filters out any non closed days from exceptional opening hours', () => {
    const result = findClosedDays(exceptionalOpeningHours);
    expect(result).toEqual([
      {
        overrideDate: new Date('2021-12-25T00:00:00.000Z'),
        overrideType: 'Christmas and New Year',
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
      {
        overrideDate: new Date('2021-12-27T00:00:00.000Z'),
        overrideType: 'Christmas and New Year',
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
    ]);
  });
});

describe('determineNextAvailableDate', () => {
  it('adds a single day to the current date, if the time is before 10am', () => {
    const result = determineNextAvailableDate(
      new Date('2021-12-9 09:00'),
      [0],
      []
    );
    expect(result).toEqual(new Date('2021-12-10 09:00'));
  });

  it('adds 2 days to the current date, if the time is after 10am', () => {
    const result = determineNextAvailableDate(
      new Date('2021-12-9 11:00'),
      [0],
      []
    );
    expect(result).toEqual(new Date('2021-12-11 11:00'));
  });

  // defers requests over the weekend appropriately
  // this encodes the test cases from https://github.com/wellcomecollection/wellcomecollection.org/issues/8215
  test.each([
    {
      description: 'Before Monday 10am',
      requestMade: new Date('2022-09-05T09:59:59+0100'), // Monday
      firstVisits: new Date('2022-09-06T09:59:59+0100'), // Tuesday
    },
    {
      description: 'Monday 10.01',
      requestMade: new Date('2022-09-05T10:01:01+0100'), // Monday
      firstVisits: new Date('2022-09-07T10:01:01+0100'), // Wednesday
    },
    {
      description: 'Before Tuesday 10am',
      requestMade: new Date('2022-09-06T09:59:59+0100'), // Tuesday
      firstVisits: new Date('2022-09-07T09:59:59+0100'), // Wednesday
    },
    {
      description: 'Tuesday 10.01',
      requestMade: new Date('2022-09-06T10:01:01+0100'), // Tuesday
      firstVisits: new Date('2022-09-08T10:01:01+0100'), // Thursday
    },
    {
      description: 'Before Wednesday 10am',
      requestMade: new Date('2022-09-07T09:59:59+0100'), // Wednesday
      firstVisits: new Date('2022-09-08T09:59:59+0100'), // Thursday
    },
    {
      description: 'Thursday 10.01',
      requestMade: new Date('2022-09-08T10:01:01+0100'), // Thursday
      firstVisits: new Date('2022-09-10T10:01:01+0100'), // Saturday
    },
    {
      description: 'Before Friday 10am',
      requestMade: new Date('2022-09-09T09:59:59+0100'), // Friday
      firstVisits: new Date('2022-09-10T09:59:59+0100'), // Saturday
    },
    {
      description: 'Friday 10.01',
      requestMade: new Date('2022-09-09T10:01:01+0100'), // Friday
      firstVisits: new Date('2022-09-12T10:01:01+0100'), // Monday
    },
    {
      description: 'Before Saturday 10am',
      requestMade: new Date('2022-09-10T09:59:59+0100'), // Saturday
      firstVisits: new Date('2022-09-12T09:59:59+0100'), // Monday
    },
    {
      description: 'Saturday 10.01',
      requestMade: new Date('2022-09-10T10:01:01+0100'), // Saturday
      firstVisits: new Date('2022-09-13T10:01:01+0100'), // Tuesday
    },
  ])(
    '$description: an item ordered at $requestMade can be retrieved on $firstVisits',
    ({ requestMade, firstVisits }) => {
      const result = determineNextAvailableDate(
        requestMade,
        [0], // Sunday
        []
      );
      expect(result).toEqual(firstVisits);
    }
  );

  it("doesn't return a date if there are no regular days that are open", () => {
    const result = determineNextAvailableDate(
      new Date(),
      [0, 1, 2, 3, 4, 5, 6],
      []
    );
    expect(result).toBeUndefined();
  });

  it('works based on 10am in London, not the user’s location', () => {
    // Paris is an hour ahead of London, so a request made at 10:30 in Paris is
    // at 09:30 in London -- it can be fulfilled the next day.
    const date1 = new Date('2021-12-09T10:30:00+0100');

    const result1 = determineNextAvailableDate(date1, [0], []);
    expect(result1).toEqual(new Date('2021-12-10T09:30:00Z'));

    // Paris is an hour ahead of London, so a request made at 11:30 in Paris is
    // at 10:30 in London -- it can’t be fulfilled the next day.
    const date2 = new Date('2021-12-09T11:30:00+0100');

    const result2 = determineNextAvailableDate(date2, [0], []);
    expect(result2).toEqual(new Date('2021-12-11T10:30:00Z'));

    // Now run the same tests, but now during British Summer Time when London
    // and UTC are different.
    const date3 = new Date('2022-09-06T10:30:00+0200');
    const result3 = determineNextAvailableDate(date3, [0], []);
    expect(result3).toEqual(new Date('2022-09-07T09:30:00+0100'));

    const date4 = new Date('2022-09-06T11:30:00+0200');
    const result4 = determineNextAvailableDate(date4, [0], []);
    expect(result4).toEqual(new Date('2022-09-08T10:30:00+0100'));
  });

  // This is based on an issue reported by email on 16 September 2022 to the
  // digital@wellcomecollection.org DL
  it('accounts for exceptional closure dates (Sept 2022 bank holiday)', () => {
    // Monday, the bank holiday for the state funeral of Queen Elizabeth II
    const stateFuneral = new Date('2022-09-19T12:00:00+0100');

    const result = determineNextAvailableDate(
      new Date('2022-09-16T18:00:00+0100'), // Friday evening
      [0], // Sunday
      [stateFuneral]
    );

    // It's past 10am on Friday, so:
    //
    //    - the library staff can retrieve the item from the stores on Saturday
    //    - nothing happens on Sunday/Monday because the library is closed
    //    - the user can view the item on Tuesday
    //
    expect(result).toEqual(new Date('2022-09-20T18:00:00+0100'));
  });

  it('accounts for exceptional closure dates', () => {
    const exceptionalClosure = new Date('2021-12-13T12:00:00Z'); // Monday
    const result = determineNextAvailableDate(
      new Date('2021-12-10T12:00:00Z'), // Friday
      [0], // Sunday
      [exceptionalClosure]
    );

    // It's past 10am on Friday, so:
    //
    //    - the library staff can retrieve the item from the stores on Saturday
    //    - nothing happens on Sunday/Monday because the library is closed
    //    - the user can view the item on Tuesday
    //
    expect(result).toEqual(new Date('2021-12-14T12:00:00Z')); // Tuesday
  });
});

describe('filterExceptionalClosedDates', () => {
  it('removes any date that is a regular closed day', () => {
    const result = filterExceptionalClosedDates(
      exceptionalClosedDates,
      [0, 1, 3]
    );

    expect(result).toEqual([
      new Date('2019-12-03'),
      new Date('2019-12-05'),
      new Date('2019-12-17'),
      new Date('2019-12-31'),
      new Date('2020-01-07'),
      new Date('2020-01-09'),
      new Date('2020-01-18'),
    ]);
  });
});

describe('includedRegularClosedDays', () => {
  it('determines how many regular closed days occur between the start and end dates, inclusive', () => {
    const result = includedRegularClosedDays({
      startDate: new Date('2020-01-03'),
      endDate: new Date('2020-01-16'),
      closedDays: [0, 1, 4],
    });

    // This is the date range:
    //
    //        January 2020
    //     Su Mo Tu We Th Fr Sa
    //                     3  4
    //      5  6  7  8  9 10 11
    //     12 13 14 15 16
    //
    // Of these, we're counting Sunday (0), Monday (1) and Thursday (4).
    expect(result).toEqual(6);
  });
});

describe('groupExceptionalClosedDates', () => {
  it("groups closed dates into those that are excluded by the start and end dates and those that aren't", () => {
    const result = groupExceptionalClosedDates({
      startDate: new Date('2020-01-03'),
      endDate: new Date('2020-01-16'),
      exceptionalClosedDates,
    });

    expect(result).toEqual({
      included: [
        new Date('2020-01-06'),
        new Date('2020-01-07'),
        new Date('2020-01-08'),
        new Date('2020-01-09'),
      ],
      excluded: [
        new Date('2019-12-03'),
        new Date('2019-12-04'),
        new Date('2019-12-05'),
        new Date('2019-12-17'),
        new Date('2019-12-31'),
        new Date('2020-01-18'),
        new Date('2020-01-19'),
        new Date('2020-01-20'),
        new Date('2020-01-22'),
      ],
    });
  });
});

describe('extendEndDate: Determines the end date to use, so that there are always the same number of available dates between the start and end date', () => {
  it('returns the original end date if no exceptional closed dates occur between the start and end date', () => {
    const result = extendEndDate({
      startDate: new Date('2021-11-03'),
      endDate: new Date('2021-11-16'),
      exceptionalClosedDates,
      closedDays: [0],
    });

    expect(result).toEqual(new Date('2021-11-16'));
  });

  it('increases the end date by the number of exceptional closed dates that occur between the start and end date', () => {
    const result = extendEndDate({
      startDate: new Date('2019-12-28'),
      endDate: new Date('2020-01-10'),
      exceptionalClosedDates,
      closedDays: [],
    });

    expect(result).toEqual(new Date('2020-01-15'));
  });

  it('increases the end date again to account for any regular closed days that occur between the start date and an extended end date', () => {
    const result = extendEndDate({
      startDate: new Date('2019-12-28'),
      endDate: new Date('2020-01-10'),
      exceptionalClosedDates,
      closedDays: [0],
    });

    expect(result).toEqual(new Date('2020-01-16'));
  });

  it('increases the end date again to account for any exceptional closed dates that occur between the start date and an extended end date', () => {
    const result = extendEndDate({
      startDate: new Date('2019-12-16'),
      endDate: new Date('2019-12-30'),
      exceptionalClosedDates,
      closedDays: [],
    });

    expect(result).toEqual(new Date('2020-01-01'));
  });

  it('repeatedly increases the end date to account for a combination of exceptional closed dates and regular closed days that occur between the start date and extended end dates', () => {
    const result = extendEndDate({
      startDate: new Date('2020-01-03'),
      endDate: new Date('2020-01-16'),
      exceptionalClosedDates,
      closedDays: [0],
    });

    expect(result).toEqual(new Date('2020-01-24'));
  });

  it("doesn't extend the end date for any regular closed day that occurs between the start date and the extended end date, if that day is also one of the exceptional closed dates", () => {
    const result = extendEndDate({
      startDate: new Date('2019-12-24'),
      endDate: new Date('2019-12-31'),
      exceptionalClosedDates,
      closedDays: [2],
    });

    expect(result).toEqual(new Date('2019-12-31'));
  });

  it("doesn't return a date if no start date is provided", () => {
    const result = extendEndDate({
      endDate: new Date('2020-01-10'),
      exceptionalClosedDates: exceptionalClosedDates,
      closedDays: [0],
    });

    expect(result).toBeUndefined();
  });

  it("doesn't return a date if no end date is provided", () => {
    const result = extendEndDate({
      startDate: new Date('2019-12-24'),
      exceptionalClosedDates,
      closedDays: [0],
    });

    expect(result).toBeUndefined();
  });
});

describe("isRequestableDate: checks the date falls between 2 specified dates and also isn't an excluded date, or excluded day", () => {
  it('returns false if the date falls outside the start and end dates', () => {
    const result = isRequestableDate({
      date: new Date('2019-12-12'),
      startDate: new Date('2019-12-17'),
      endDate: new Date('2019-12-31'),
      excludedDates: [],
      excludedDays: [],
    });
    expect(result).toEqual(false);
  });

  it('returns true if the date falls between the start and end dates, inclusive', () => {
    const result = isRequestableDate({
      date: new Date('2019-12-17'),
      startDate: new Date('2019-12-17'),
      endDate: new Date('2019-12-31'),
      excludedDates: [],
      excludedDays: [],
    });
    expect(result).toEqual(true);
  });

  it('returns false if the date falls on an excluded Day', () => {
    const result = isRequestableDate({
      date: new Date('2019-12-17'), // Tuesday
      startDate: new Date('2019-12-17'),
      endDate: new Date('2019-12-31'),
      excludedDates: [],
      excludedDays: [2], // Tuesday
    });
    expect(result).toEqual(false);
  });

  it('returns false if the date falls on an excluded date', () => {
    const result = isRequestableDate({
      date: new Date('2019-12-20'),
      startDate: new Date('2019-12-17'),
      endDate: new Date('2019-12-31'),
      excludedDates: [new Date('2019-12-20')],
      excludedDays: [],
    });
    expect(result).toEqual(false);
  });

  it('returns true if there are no start and end dates', () => {
    const result = isRequestableDate({
      date: new Date('2019-12-20'),
      excludedDates: [],
      excludedDays: [],
    });
    expect(result).toEqual(true);
  });

  it('returns true if there is no start date and the date falls on or before the end date', () => {
    const result = isRequestableDate({
      date: new Date('2019-12-20'),
      endDate: new Date('2019-12-31'),
      excludedDates: [],
      excludedDays: [],
    });
    expect(result).toEqual(true);
  });

  it('returns true if there is no end date and the date falls on or after the start date', () => {
    const result = isRequestableDate({
      date: new Date('2019-12-20'),
      startDate: new Date('2019-12-17'),
      excludedDates: [],
      excludedDays: [],
    });
    expect(result).toEqual(true);
  });

  it('returns true if there are start and end dates and the date falls on the start date', () => {
    const result = isRequestableDate({
      date: new Date('2019-12-17T01:00:00Z'),
      startDate: new Date('2019-12-17T12:00:00Z'),
      endDate: new Date('2019-12-31'),
      excludedDates: [],
      excludedDays: [],
    });
    expect(result).toEqual(true);
  });
});
