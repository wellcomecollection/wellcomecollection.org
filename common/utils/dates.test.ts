import { isFuture, isPast } from './dates';

it('identifies dates in the past', () => {
  expect(isPast(new Date(2001, 1, 1, 1, 1, 1, 999))).toEqual(true);
});

it('identifies dates in the future', () => {
  expect(isFuture(new Date(3000, 1, 1, 1, 1, 1, 1))).toEqual(true);
});
