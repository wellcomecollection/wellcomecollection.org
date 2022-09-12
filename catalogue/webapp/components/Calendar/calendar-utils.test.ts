import {
  groupIntoSize,
  daysFromStartOfWeek,
  daysUntilEndOfWeek,
  getCalendarRows,
  firstDayOfWeek,
  lastDayOfWeek,
  getDatesInMonth,
} from './calendar-utils';
import { formatDate } from '@weco/common/utils/format-date';
import { isSameDay } from '@weco/common/utils/dates';

describe('sliceIntoSize', () => {
  const originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  it('groups an array into arrays of a specified size', () => {
    const result = groupIntoSize(originalArray, 7);
    expect(result).toEqual([
      [1, 2, 3, 4, 5, 6, 7],
      [8, 9, 10, 11, 12, 13, 14],
    ]);
  });
  it('it fills the last group with as many items as possible', () => {
    const result = groupIntoSize(originalArray, 6);
    expect(result).toEqual([
      [1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12],
      [13, 14],
    ]);
  });
});

describe('daysFromStartOfWeek: gives the number of days between the first day of the week and the current day', () => {
  it('returns 6, if the week starts on a Monday and the Month starts on a Sunday', () => {
    expect(daysFromStartOfWeek(1, 0)).toEqual(6);
  });
  it('returns 3, if the week starts on a Monday and the Month starts on a Thursday', () => {
    expect(daysFromStartOfWeek(1, 4)).toEqual(3);
  });
  it('returns 4, if the week starts on a Wednesday and the Month starts on a Sunday', () => {
    expect(daysFromStartOfWeek(3, 0)).toEqual(4);
  });
  it('returns 3, if the week starts on a Wednesday and the Month starts on a Saturday', () => {
    expect(daysFromStartOfWeek(3, 6)).toEqual(3);
  });
});

describe('daysUntilEndOfWeek: gives the number of days between the last day of the week and the current day', () => {
  it('returns 0, if the week starts on a Monday and the Month ends on a Sunday', () => {
    expect(daysUntilEndOfWeek(1, 0)).toEqual(0);
  });
  it('returns 3, if the week starts on a Monday and the Month ends on a Thursday', () => {
    expect(daysUntilEndOfWeek(1, 4)).toEqual(3);
  });
  it('returns 2, if the week starts on a Wednesday and the Month ends on a Sunday', () => {
    expect(daysUntilEndOfWeek(3, 0)).toEqual(2);
  });
  it('returns 3, if the week starts on a Wednesday and the Month ends on a Saturday', () => {
    expect(daysUntilEndOfWeek(3, 6)).toEqual(3);
  });
});

describe('getDatesInMonth', () => {
  it('gets all the days in a month', () => {
    const result = getDatesInMonth(new Date('2022-09-07T12:00:00Z')).map(d =>
      formatDate(d)
    );

    expect(result.length).toBe(30);
    expect(result.includes('1 September 2022')).toBe(true);
    expect(result.includes('30 September 2022')).toBe(true);
    expect(result.find(d => d.indexOf('September') === -1)).toBe(undefined);
  });

  it('knows about leap years', () => {
    const result1 = getDatesInMonth(new Date('2022-02-07T12:00:00Z')).map(d =>
      formatDate(d)
    );

    expect(result1.length).toBe(28);

    const result2 = getDatesInMonth(new Date('2020-02-07T12:00:00Z')).map(d =>
      formatDate(d)
    );

    expect(result2.length).toBe(29);
  });
});

describe('getCalendarRows', () => {
  // Based on `cal March 2022`
  //
  //         March 2022
  //    Mo Tu We Th Fr Sa Su
  //        1  2  3  4  5  6
  //     7  8  9 10 11 12 13
  //    14 15 16 17 18 19 20
  //    21 22 23 24 25 26 27
  //    28 29 30 31
  it('generates dates for each day of a given month and groups them into weeks. It pads the first and last group arrays, so that the first day of the month is placed at the correct index', () => {
    const result = getCalendarRows(new Date('2022-03-01'));

    // month starts on Tuesday so the first day of the week is padded
    // with the last day of the previous month
    expect(isSameDay(result[0][0], new Date('2022-02-28'))).toBe(true);

    expect(isSameDay(result[0][1], new Date('2022-03-01'))).toBe(true);
    expect(isSameDay(result[4][3], new Date('2022-03-31'))).toBe(true);

    // month ends on Thursday so the last days of the week are padded
    // with the first days of the next month
    expect(isSameDay(result[4][4], new Date('2022-04-01'))).toBe(true);
  });
});

describe('firstDayOfWeek', () => {
  it('returns the first item from the array which contains the provided date', () => {
    const calendarRows = getCalendarRows(new Date('2022-03-01'));
    const result = firstDayOfWeek(new Date('2022-03-30'), calendarRows);
    expect(isSameDay(result, new Date('2022-03-28')));
  });
});

describe('firstDayOfWeek', () => {
  it('returns the last item from the array which contains the provided date', () => {
    const calendarRows = getCalendarRows(new Date('2022-03-01'));
    const result = lastDayOfWeek(new Date('2022-03-30'), calendarRows);
    expect(isSameDay(result, new Date('2022-04-03'))).toBe(true);
  });
});
