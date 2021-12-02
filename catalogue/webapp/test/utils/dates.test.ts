import { london } from '@weco/common/utils/format-date';
import {
  determineNextAvailableDate,
  filterExceptionalClosedDates,
  includedRegularClosedDays,
  groupExceptionalClosedDates,
  extendEndDate,
} from '../../utils/dates';

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

describe('determineNextAvailableDate', () => {
  // TODO regular closed days from Prismic
  it.only('adds a single day to the current date, if the time is before 10am', () => {
    const result = determineNextAvailableDate(london('2021-12-9 09:00'));
    expect(result.toDate()).toEqual(london('2021-12-10 09:00').toDate());
  });

  it.only('adds 2 days to the current date, if the time is after 10am', () => {
    const result = determineNextAvailableDate(london('2021-12-9 11:00'));
    expect(result.toDate()).toEqual(london('2021-12-11 11:00').toDate());
  });

  // it.only('returns the next Monday rather than a Sunday', () => { // regular Closed day
  //   const result = determineNextAvailableDate(london('2021-12-9 09:30'));
  //   expect(result.toDate()).toEqual(london('2021-12-10').toDate());
  // });
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
  it('it returns the original end date if no exceptional closed dates occur between the start and end date', () => {
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

  it('it increases the end date again to account for any regular closed days that occur between the start date and an extended end date', () => {
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

  it('it repeatedly increases the end date to account for a combination of exceptional closed dates and regular closed days that occur between the start date and extended end dates', () => {
    const result = extendEndDate({
      startDate: london(new Date('2020-01-03')),
      endDate: london(new Date('2020-01-16')),
      exceptionalClosedDates: exceptionalClosedDates,
      regularClosedDays: [0],
    });

    expect(result.toDate()).toEqual(london(new Date('2020-01-24')).toDate());
  });

  it("it doesn't extend the end date for any regular closed day that occurs between the start date and the extended end date, if that day is also one of the exceptional closed dates", () => {
    const result = extendEndDate({
      startDate: london(new Date('2019-12-24')),
      endDate: london(new Date('2019-12-31')),
      exceptionalClosedDates: exceptionalClosedDates,
      regularClosedDays: [2],
    });

    expect(result.toDate()).toEqual(london(new Date('2019-12-31')).toDate());
  });
});
