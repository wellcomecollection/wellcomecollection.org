import {
  columnCountFor,
  extraColumnBreakpoints,
  shortestColumns,
} from './masonry-layout';

describe('columnCountFor', () => {
  it('has fewer columns as the sidebar takes more of the page', () => {
    const viewportWidth = 1440;
    const pageGridWidth = 1296;
    const count = (share: number) =>
      columnCountFor({
        gridWidth: pageGridWidth * share,
        viewportWidth,
        isSmallScreen: false,
      });

    expect(count(12 / 12)).toBe(4);
    expect(count(9 / 12)).toBe(3);
    expect(count(6 / 12)).toBe(2);
    expect(count(3 / 12)).toBe(1);
  });

  it('gives wide screens more columns, not wider ones', () => {
    // At 2560px the results use all but the 5% padding either side (2304px),
    // and columns aim for 3/12 of a 1440px page (324px)
    expect(
      columnCountFor({
        gridWidth: 2304,
        viewportWidth: 2560,
        isSmallScreen: false,
      })
    ).toBe(7);
  });
});

describe('extraColumnBreakpoints', () => {
  it('matches columnCountFor for the full-width grid', () => {
    extraColumnBreakpoints().forEach(([columns, minWidth]) => {
      const countAt = (viewportWidth: number) =>
        columnCountFor({
          gridWidth: viewportWidth * 0.9,
          viewportWidth,
          isSmallScreen: false,
        });
      expect(countAt(minWidth)).toBe(columns);
      expect(countAt(minWidth - 1)).toBe(columns - 1);
    });
  });
});

describe('shortestColumns', () => {
  it('puts each card in the shortest column so far, leftmost if tied', () => {
    // Columns: [10, 5, 8] after the first row, then 4 goes under the 5,
    // making it 9, then 2 under the 8
    expect(shortestColumns([10, 5, 8, 4, 2], 3)).toEqual([0, 1, 2, 1, 2]);
  });
});
