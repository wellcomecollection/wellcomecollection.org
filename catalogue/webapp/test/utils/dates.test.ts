import { london } from '@weco/common/utils/format-date';
import {
  determineNextAvailableDate,
  filterExceptionalClosedDates,
  includedRegularClosedDays,
  groupExceptionalClosedDates,
  extendEndDate,
  findClosedDays,
} from '../../utils/dates';
import { OverrideType } from '@weco/common/model/opening-hours';

const exceptionalClosedDates = [
  london(new Date('2019-12-03')),
  london(new Date('2019-12-04')),
  london(new Date('2019-12-05')),
  london(new Date('2019-12-17')),
  london(new Date('2019-12-31')),
  london(new Date('2020-01-06')),
  london(new Date('2020-01-07')),
  london(new Date('2020-01-08')),
  london(new Date('2020-01-09')),
  london(new Date('2020-01-18')),
  london(new Date('2020-01-19')),
  london(new Date('2020-01-20')),
  london(new Date('2020-01-22')),
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
];

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

describe('determineNextAvailableDate', () => {
  it('adds a single day to the current date, if the time is before 10am', () => {
    const result = determineNextAvailableDate(london('2021-12-9 09:00'), [0]);
    expect(result.toDate()).toEqual(london('2021-12-10 09:00').toDate());
  });

  it('adds 2 days to the current date, if the time is after 10am', () => {
    const result = determineNextAvailableDate(london('2021-12-9 11:00'), [0]);
    expect(result.toDate()).toEqual(london('2021-12-11 11:00').toDate());
  });

  it('returns the following Monday rather than a Sunday', () => {
    const result = determineNextAvailableDate(london('2021-12-10 10:30'), [0]);
    expect(result.toDate()).toEqual(london('2021-12-13 10:30').toDate());
  });
});

describe('filterExceptionalClosedDates', () => {
  it('removes any date that is a regular closed day', () => {
    const result = filterExceptionalClosedDates(
      exceptionalClosedDates,
      [0, 1, 3]
    );

    expect(result).toEqual([
      london(new Date('2019-12-03')),
      london(new Date('2019-12-05')),
      london(new Date('2019-12-17')),
      london(new Date('2019-12-31')),
      london(new Date('2020-01-07')),
      london(new Date('2020-01-09')),
      london(new Date('2020-01-18')),
    ]);
  });
});

describe('includedRegularClosedDays', () => {
  it('determines how many regular closed days occur between the start and end dates, inlcusive', () => {
    const result = includedRegularClosedDays({
      startDate: london(new Date('2020-01-03')),
      endDate: london(new Date('2020-01-16')),
      regularClosedDays: [0, 1, 4],
    });

    expect(result).toEqual(6);
  });
});

describe('groupExceptionalClosedDates', () => {
  it("groups closed dates into those that are excluded by the start and end dates and those that aren't", () => {
    const result = groupExceptionalClosedDates({
      startDate: london(new Date('2020-01-03')),
      endDate: london(new Date('2020-01-16')),
      exceptionalClosedDates: exceptionalClosedDates,
    });

    expect(result).toEqual({
      included: [
        london(new Date('2020-01-06')),
        london(new Date('2020-01-07')),
        london(new Date('2020-01-08')),
        london(new Date('2020-01-09')),
      ],
      excluded: [
        london(new Date('2019-12-03')),
        london(new Date('2019-12-04')),
        london(new Date('2019-12-05')),
        london(new Date('2019-12-17')),
        london(new Date('2019-12-31')),
        london(new Date('2020-01-18')),
        london(new Date('2020-01-19')),
        london(new Date('2020-01-20')),
        london(new Date('2020-01-22')),
      ],
    });
  });
});

describe('extendEndDate: Determines the end date to use, so that there are always the same number of available dates between the start and end date', () => {
  it('returns the original end date if no exceptional closed dates occur between the start and end date', () => {
    const result = extendEndDate({
      startDate: london(new Date('2021-11-03')),
      endDate: london(new Date('2021-11-16')),
      exceptionalClosedDates: exceptionalClosedDates,
      regularClosedDays: [0],
    });

    expect(result.toDate()).toEqual(london(new Date('2021-11-16')).toDate());
  });

  it('increases the end date by the number of exceptional closed dates that occur between the start and end date', () => {
    const result = extendEndDate({
      startDate: london(new Date('2019-12-28')),
      endDate: london(new Date('2020-01-10')),
      exceptionalClosedDates: exceptionalClosedDates,
      regularClosedDays: [],
    });

    expect(result.toDate()).toEqual(london(new Date('2020-01-15')).toDate());
  });

  it('increases the end date again to account for any regular closed days that occur between the start date and an extended end date', () => {
    const result = extendEndDate({
      startDate: london(new Date('2019-12-28')),
      endDate: london(new Date('2020-01-10')),
      exceptionalClosedDates: exceptionalClosedDates,
      regularClosedDays: [0],
    });

    expect(result.toDate()).toEqual(london(new Date('2020-01-16')).toDate());
  });

  it('increases the end date again to account for any exceptional closed dates that occur between the start date and an extended end date', () => {
    const result = extendEndDate({
      startDate: london(new Date('2019-12-16')),
      endDate: london(new Date('2019-12-30')),
      exceptionalClosedDates: exceptionalClosedDates,
      regularClosedDays: [],
    });

    expect(result.toDate()).toEqual(london(new Date('2020-01-01')).toDate());
  });

  it('repeatedly increases the end date to account for a combination of exceptional closed dates and regular closed days that occur between the start date and extended end dates', () => {
    const result = extendEndDate({
      startDate: london(new Date('2020-01-03')),
      endDate: london(new Date('2020-01-16')),
      exceptionalClosedDates: exceptionalClosedDates,
      regularClosedDays: [0],
    });

    expect(result.toDate()).toEqual(london(new Date('2020-01-24')).toDate());
  });

  it("doesn't extend the end date for any regular closed day that occurs between the start date and the extended end date, if that day is also one of the exceptional closed dates", () => {
    const result = extendEndDate({
      startDate: london(new Date('2019-12-24')),
      endDate: london(new Date('2019-12-31')),
      exceptionalClosedDates: exceptionalClosedDates,
      regularClosedDays: [2],
    });

    expect(result.toDate()).toEqual(london(new Date('2019-12-31')).toDate());
  });
});
