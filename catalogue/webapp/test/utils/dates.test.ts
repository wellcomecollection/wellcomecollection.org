import { london } from '@weco/common/utils/format-date';
import {
  determineNextAvailableDate,
  filterExceptionalClosedDates,
  includedRegularClosedDays,
  groupExceptionalClosedDates,
  extendEndDate,
  findClosedDays,
  findNextRegularOpenDay,
  isRequestableDate,
} from '../../utils/dates';
import {
  OverrideType,
  OpeningHoursDay,
} from '@weco/common/model/opening-hours';

const exceptionalClosedDates = [
  london('2019-12-03'),
  london('2019-12-04'),
  london('2019-12-05'),
  london('2019-12-17'),
  london('2019-12-31'),
  london('2020-01-06'),
  london('2020-01-07'),
  london('2020-01-08'),
  london('2020-01-09'),
  london('2020-01-18'),
  london('2020-01-19'),
  london('2020-01-20'),
  london('2020-01-22'),
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
    overrideDate: london('2021-12-25T00:00:00.000Z'),
    overrideType: 'Christmas and New Year' as OverrideType,
    opens: '00:00',
    closes: '00:00',
    isClosed: true,
  },
  {
    overrideDate: london('2021-12-26T00:00:00.000Z'),
    overrideType: 'Christmas and New Year' as OverrideType,
    opens: '12:00',
    closes: '14:00',
    isClosed: false,
  },
  {
    overrideDate: london('2021-12-27T00:00:00.000Z'),
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
        overrideDate: london('2021-12-25T00:00:00.000Z'),
        overrideType: 'Christmas and New Year',
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
      {
        overrideDate: london('2021-12-27T00:00:00.000Z'),
        overrideType: 'Christmas and New Year',
        opens: '00:00',
        closes: '00:00',
        isClosed: true,
      },
    ]);
  });
});

describe('findNextRegularOpenDay: finds the earliest date on which the venue is normally open', () => {
  it('returns the same date provided if it occurs on one of the regular open days', () => {
    const result = findNextRegularOpenDay(
      london('2022-01-15'), // Saturday
      [0, 1, 2] // Sunday, Monday, Tuesday
    );
    expect(result.toDate()).toEqual(london('2022-01-15').toDate()); // Saturday
  });
  it('returns the date of the next regular open day, if the date provided is a regular closed day', () => {
    const result = findNextRegularOpenDay(
      london('2022-01-16'), // Sunday
      [0, 1, 2] // Sunday, Monday, Tuesday
    );
    expect(result.toDate()).toEqual(london('2022-01-19').toDate()); // Wednesday
  });
  it("doesn't return a date if there are no regular days that are open", () => {
    const result = findNextRegularOpenDay(
      london('2022-01-16'), // Sunday
      [0, 1, 2, 3, 4, 5, 6]
    );
    expect(result).toBeUndefined();
  });
});

describe('determineNextAvailableDate', () => {
  it('adds a single day to the current date, if the time is before 10am', () => {
    const result = determineNextAvailableDate(london('2021-12-9 09:00'), [0]);
    expect(result.toDate()).toEqual(london('2021-12-10 09:00').toDate());
  });

  it('adds 2 days to the current date, if the time is after 10am', () => {
    const result = determineNextAvailableDate(london('2021-12-9 11:00'), [0]);
    expect(result.toDate()).toEqual(london('2021-12-11 11:00').toDate());
  });

  it('returns the following Monday rather than a Sunday, if the Sunday is the only closed day', () => {
    const result = determineNextAvailableDate(london('2021-12-10 10:30'), [0]);
    expect(result.toDate()).toEqual(london('2021-12-13 10:30').toDate());
  });

  it("doesn't return a date if there are no regular days that are open", () => {
    const result = determineNextAvailableDate(london(), [0, 1, 2, 3, 4, 5, 6]);
    expect(result).toBeUndefined();
  });
});

describe('filterExceptionalClosedDates', () => {
  it('removes any date that is a regular closed day', () => {
    const result = filterExceptionalClosedDates(
      exceptionalClosedDates,
      [0, 1, 3]
    );

    expect(result).toEqual([
      london('2019-12-03'),
      london('2019-12-05'),
      london('2019-12-17'),
      london('2019-12-31'),
      london('2020-01-07'),
      london('2020-01-09'),
      london('2020-01-18'),
    ]);
  });
});

describe('includedRegularClosedDays', () => {
  it('determines how many regular closed days occur between the start and end dates, inclusive', () => {
    const result = includedRegularClosedDays({
      startDate: london('2020-01-03'),
      endDate: london('2020-01-16'),
      closedDays: [0, 1, 4],
    });

    expect(result).toEqual(6);
  });
});

describe('groupExceptionalClosedDates', () => {
  it("groups closed dates into those that are excluded by the start and end dates and those that aren't", () => {
    const result = groupExceptionalClosedDates({
      startDate: london('2020-01-03'),
      endDate: london('2020-01-16'),
      exceptionalClosedDates: exceptionalClosedDates,
    });

    expect(result).toEqual({
      included: [
        london('2020-01-06'),
        london('2020-01-07'),
        london('2020-01-08'),
        london('2020-01-09'),
      ],
      excluded: [
        london('2019-12-03'),
        london('2019-12-04'),
        london('2019-12-05'),
        london('2019-12-17'),
        london('2019-12-31'),
        london('2020-01-18'),
        london('2020-01-19'),
        london('2020-01-20'),
        london('2020-01-22'),
      ],
    });
  });
});

describe('extendEndDate: Determines the end date to use, so that there are always the same number of available dates between the start and end date', () => {
  it('returns the original end date if no exceptional closed dates occur between the start and end date', () => {
    const result = extendEndDate({
      startDate: london('2021-11-03'),
      endDate: london('2021-11-16'),
      exceptionalClosedDates: exceptionalClosedDates,
      closedDays: [0],
    });

    expect(result.toDate()).toEqual(london('2021-11-16').toDate());
  });

  it('increases the end date by the number of exceptional closed dates that occur between the start and end date', () => {
    const result = extendEndDate({
      startDate: london('2019-12-28'),
      endDate: london('2020-01-10'),
      exceptionalClosedDates: exceptionalClosedDates,
      closedDays: [],
    });

    expect(result.toDate()).toEqual(london('2020-01-15').toDate());
  });

  it('increases the end date again to account for any regular closed days that occur between the start date and an extended end date', () => {
    const result = extendEndDate({
      startDate: london('2019-12-28'),
      endDate: london('2020-01-10'),
      exceptionalClosedDates: exceptionalClosedDates,
      closedDays: [0],
    });

    expect(result.toDate()).toEqual(london('2020-01-16').toDate());
  });

  it('increases the end date again to account for any exceptional closed dates that occur between the start date and an extended end date', () => {
    const result = extendEndDate({
      startDate: london('2019-12-16'),
      endDate: london('2019-12-30'),
      exceptionalClosedDates: exceptionalClosedDates,
      closedDays: [],
    });

    expect(result.toDate()).toEqual(london('2020-01-01').toDate());
  });

  it('repeatedly increases the end date to account for a combination of exceptional closed dates and regular closed days that occur between the start date and extended end dates', () => {
    const result = extendEndDate({
      startDate: london('2020-01-03'),
      endDate: london('2020-01-16'),
      exceptionalClosedDates: exceptionalClosedDates,
      closedDays: [0],
    });

    expect(result.toDate()).toEqual(london('2020-01-24').toDate());
  });

  it("doesn't extend the end date for any regular closed day that occurs between the start date and the extended end date, if that day is also one of the exceptional closed dates", () => {
    const result = extendEndDate({
      startDate: london('2019-12-24'),
      endDate: london('2019-12-31'),
      exceptionalClosedDates: exceptionalClosedDates,
      closedDays: [2],
    });

    expect(result.toDate()).toEqual(london('2019-12-31').toDate());
  });

  it("doesn't return a date if no start date is provided", () => {
    const result = extendEndDate({
      endDate: london('2020-01-10'),
      exceptionalClosedDates: exceptionalClosedDates,
      closedDays: [0],
    });

    expect(result).toBeUndefined();
  });

  it("doesn't return a date if no end date is provided", () => {
    const result = extendEndDate({
      startDate: london('2019-12-24'),
      exceptionalClosedDates: exceptionalClosedDates,
      closedDays: [0],
    });

    expect(result).toBeUndefined();
  });
});

describe("isRequestableDate: checks the date falls between 2 specified dates and also isn't an excluded date, or excluded day", () => {
  it('returns false if the date falls outside the start and end dates', () => {
    const result = isRequestableDate({
      date: london('2019-12-12'),
      startDate: london('2019-12-17'),
      endDate: london('2019-12-31'),
      excludedDates: [],
      excludedDays: [],
    });
    expect(result).toEqual(false);
  });

  it('returns true if the date falls between the start and end dates, inclusive', () => {
    const result = isRequestableDate({
      date: london('2019-12-17'),
      startDate: london('2019-12-17'),
      endDate: london('2019-12-31'),
      excludedDates: [],
      excludedDays: [],
    });
    expect(result).toEqual(true);
  });

  it('returns false if the date falls on an excluded Day', () => {
    const result = isRequestableDate({
      date: london('2019-12-17'), // Tuesday
      startDate: london('2019-12-17'),
      endDate: london('2019-12-31'),
      excludedDates: [],
      excludedDays: [2], // Tuesday
    });
    expect(result).toEqual(false);
  });

  it('returns false if the date falls on an excluded date', () => {
    const result = isRequestableDate({
      date: london('2019-12-20'),
      startDate: london('2019-12-17'),
      endDate: london('2019-12-31'),
      excludedDates: [london('2019-12-20')],
      excludedDays: [],
    });
    expect(result).toEqual(false);
  });

  it('returns true if there are no start and end dates', () => {
    const result = isRequestableDate({
      date: london('2019-12-20'),
      excludedDates: [],
      excludedDays: [],
    });
    expect(result).toEqual(true);
  });

  it('returns true if the there is no start date and the date falls on or before the end date', () => {
    const result = isRequestableDate({
      date: london('2019-12-20'),
      endDate: london('2019-12-31'),
      excludedDates: [],
      excludedDays: [],
    });
    expect(result).toEqual(true);
  });

  it('returns true if the there is no end date and the date falls on or after the start date', () => {
    const result = isRequestableDate({
      date: london('2019-12-20'),
      startDate: london('2019-12-17'),
      excludedDates: [],
      excludedDays: [],
    });
    expect(result).toEqual(true);
  });
});
