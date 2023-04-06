import { isNotUndefined } from './type-guards';

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
