import { isNotUndefined, isObject } from './type-guards';

describe('notUndefined', () => {
  it('filters out undefined and leaves nullish values', () => {
    const filtered = [
      0,
      null,
      '',
      'strings',
      undefined,
      [],
      undefined,
      [1, 2, 3],
      { legs: 'logs' },
    ].filter(isNotUndefined);

    expect(filtered).toStrictEqual([
      0,
      null,
      '',
      'strings',
      [],
      [1, 2, 3],
      { legs: 'logs' },
    ]);
  });
});

describe('isObject', () => {
  it('is true for plain objects', () => {
    expect(isObject({})).toBe(true);
    expect(isObject({ legs: 'logs' })).toBe(true);
  });

  it('is false for null and undefined', () => {
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
  });

  it('is false for primitives', () => {
    expect(isObject('strings')).toBe(false);
    expect(isObject(0)).toBe(false);
    expect(isObject(false)).toBe(false);
  });

  it('is false for arrays', () => {
    expect(isObject([])).toBe(false);
    expect(isObject([1, 2, 3])).toBe(false);
  });
});
