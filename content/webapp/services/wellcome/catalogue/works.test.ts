import { getArchiveCategoryWorksSort } from './works';

describe('getArchiveCategoryWorksSort', () => {
  it('defaults to title A-Z when there are no sort params', () => {
    expect(getArchiveCategoryWorksSort({})).toEqual({
      sort: 'title',
      sortOrder: 'asc',
    });
  });

  it('uses the requested sort and sortOrder when both are valid', () => {
    expect(
      getArchiveCategoryWorksSort({
        sort: 'production.dates',
        sortOrder: 'asc',
      })
    ).toEqual({ sort: 'production.dates', sortOrder: 'asc' });

    expect(
      getArchiveCategoryWorksSort({ sort: 'title', sortOrder: 'desc' })
    ).toEqual({ sort: 'title', sortOrder: 'desc' });
  });

  it("falls back to the field's own default order when sortOrder is missing or invalid", () => {
    expect(getArchiveCategoryWorksSort({ sort: 'title' })).toEqual({
      sort: 'title',
      sortOrder: 'asc',
    });

    expect(
      getArchiveCategoryWorksSort({
        sort: 'production.dates',
        sortOrder: 'sideways',
      })
    ).toEqual({ sort: 'production.dates', sortOrder: 'desc' });
  });

  it('falls back to title when sort is missing or unknown', () => {
    expect(getArchiveCategoryWorksSort({ sortOrder: 'desc' })).toEqual({
      sort: 'title',
      sortOrder: 'desc',
    });

    expect(getArchiveCategoryWorksSort({ sort: 'nonsense' })).toEqual({
      sort: 'title',
      sortOrder: 'asc',
    });
  });

  it('ignores repeated params rather than picking one', () => {
    expect(
      getArchiveCategoryWorksSort({
        sort: ['title', 'production.dates'],
        sortOrder: ['asc', 'desc'],
      })
    ).toEqual({ sort: 'title', sortOrder: 'asc' });
  });
});
