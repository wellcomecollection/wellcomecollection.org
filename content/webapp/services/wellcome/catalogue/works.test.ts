import { getArchiveCategoryWorksSort } from './works';

describe('getArchiveCategoryWorksSort', () => {
  it('defaults to title A-Z when there are no sort params', () => {
    expect(getArchiveCategoryWorksSort({})).toEqual({
      sort: 'title',
      sortOrder: 'asc',
    });
  });

  it('uses the requested date sort order', () => {
    expect(
      getArchiveCategoryWorksSort({
        sort: 'production.dates',
        sortOrder: 'asc',
      })
    ).toEqual({ sort: 'production.dates', sortOrder: 'asc' });

    expect(
      getArchiveCategoryWorksSort({
        sort: 'production.dates',
        sortOrder: 'desc',
      })
    ).toEqual({ sort: 'production.dates', sortOrder: 'desc' });
  });

  it('sorts dates newest first when sortOrder is missing or invalid', () => {
    expect(getArchiveCategoryWorksSort({ sort: 'production.dates' })).toEqual({
      sort: 'production.dates',
      sortOrder: 'desc',
    });

    expect(
      getArchiveCategoryWorksSort({
        sort: 'production.dates',
        sortOrder: 'sideways',
      })
    ).toEqual({ sort: 'production.dates', sortOrder: 'desc' });
  });

  it('always sorts titles A-Z, ignoring a requested Z-A', () => {
    expect(
      getArchiveCategoryWorksSort({ sort: 'title', sortOrder: 'desc' })
    ).toEqual({ sort: 'title', sortOrder: 'asc' });
  });

  it('falls back to title A-Z when sort is missing or unknown', () => {
    expect(getArchiveCategoryWorksSort({ sortOrder: 'desc' })).toEqual({
      sort: 'title',
      sortOrder: 'asc',
    });

    expect(
      getArchiveCategoryWorksSort({ sort: 'nonsense', sortOrder: 'desc' })
    ).toEqual({ sort: 'title', sortOrder: 'asc' });
  });

  it('ignores repeated params rather than picking one', () => {
    expect(
      getArchiveCategoryWorksSort({
        sort: ['production.dates', 'title'],
        sortOrder: ['asc', 'desc'],
      })
    ).toEqual({ sort: 'title', sortOrder: 'asc' });
  });
});
