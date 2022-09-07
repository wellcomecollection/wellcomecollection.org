import {
  groupIntoSize,
  daysFromStartOfWeek,
  daysUntilEndOfWeek,
  getCalendarRows,
  firstDayOfWeek,
  lastDayOfWeek,
} from './calendar-utils';
import { london } from '../../utils/format-date';

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

describe('getCalendarRows', () => {
  it('generates Moments for each day of a given month and groups them into weeks. It pads the first and last group arrays, so that the first day of the month is placed at the correct index', () => {
    const result = getCalendarRows(london('2022-03-01'));
    expect(result[0][0]?.toDate()).toEqual(london('2022-02-28').toDate()); // month starts on Tuesday so the first day of the week is padded with the last day of the previous month
    expect(result[0][1]?.toDate()).toEqual(london('2022-03-01').toDate());
    expect(result[result.length - 1][3]?.toDate()).toEqual(
      london('2022-03-31').toDate()
    );
    expect(result[result.length - 1][4]?.toDate()).toEqual(
      london('2022-04-01').toDate()
    ); // month ends on Thursday so the last days of the week are padded with the first days of the next month
  });
});

describe('firstDayOfWeek', () => {
  it('returns the first item from the array which contains the provided date', () => {
    const calendarRows = getCalendarRows(london('2022-03-01'));
    const result = firstDayOfWeek(london('2022-03-30'), calendarRows);
    expect(result.toDate()).toEqual(london('2022-03-28').toDate());
  });
});

describe('firstDayOfWeek', () => {
  it('returns the last item from the array which contains the provided date', () => {
    const calendarRows = getCalendarRows(london('2022-03-01'));
    const result = lastDayOfWeek(london('2022-03-30'), calendarRows);
    expect(result.toDate()).toEqual(london('2022-04-03').toDate());
  });
});
