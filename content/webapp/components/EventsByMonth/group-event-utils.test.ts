import { getMonthsInDateRange } from './group-event-utils';

describe('getMonthsInDateRange', () => {
  it('finds a single month', () => {
    const result = getMonthsInDateRange({
      start: new Date(2001, 1, 1),
      end: new Date(2001, 1, 5),
    });
    expect(result).toEqual([{ year: 2001, month: 1 }]);
  });

  it('finds multiple months', () => {
    const result = getMonthsInDateRange({
      start: new Date(2001, 1, 1),
      end: new Date(2001, 3, 6),
    });
    expect(result).toEqual([
      { year: 2001, month: 1 },
      { year: 2001, month: 2 },
      { year: 2001, month: 3 },
    ]);
  });
});
