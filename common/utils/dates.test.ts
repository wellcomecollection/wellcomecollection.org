import each from 'jest-each';
import { isFuture, isPast, isSameDay } from './dates';

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
