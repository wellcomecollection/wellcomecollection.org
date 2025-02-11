import { clamp, simplifyCount } from './numeric';

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

describe('simplifyCount', () => {
  test.each([
    // number is less than 1000
    { number: 1, expected: 1 },
    { number: 999, expected: 999 },

    // number is 1000 or more
    { number: 1000, expected: '1K' },
    { number: 1001, expected: '1K' }, // Note: not 1.0K
    { number: 1500, expected: '1.5K' },
    { number: 2000, expected: '2K' },
    { number: 9999, expected: '10K' },
  ])('simplifying $number is $expected', ({ number, expected }) => {
    expect(simplifyCount(number)).toStrictEqual(expected);
  });
});
