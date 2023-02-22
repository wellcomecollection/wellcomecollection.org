import { clamp } from './numeric';

describe('clamp', () => {
  test.each([
    // x is on one of the boundaries
    { x: 1, min: 0, max: 1, expected: 1 },
    { x: 0, min: 0, max: 1, expected: 0 },

    // x is outside the boundaries
    { x: 2, min: 0, max: 1, expected: 1 },
    { x: -1, min: 0, max: 1, expected: 0 },

    // x is between the boundaries
    { x: 0.5, min: 0, max: 1, expected: 0.5 },
  ])(
    'clamping $x between [$min, $max] is $expected',
    ({ x, min, max, expected }) => {
      expect(clamp(x, min, max)).toStrictEqual(expected);
    }
  );
});
