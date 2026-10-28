import {
  maxPageSize,
  parseClientSideDocumentIds,
  parseClientSideListParams,
} from './client-side-params';

describe('parseClientSideListParams', () => {
  it('keeps page, pageSize and filters', () => {
    expect(
      parseClientSideListParams({
        page: 2,
        pageSize: 5,
        filters: ['[at(my.articles.series.series, "test-series")]'],
      })
    ).toEqual({
      page: 2,
      pageSize: 5,
      filters: ['[at(my.articles.series.series, "test-series")]'],
    });
  });

  it('drops any other options', () => {
    expect(
      parseClientSideListParams({
        ref: 'test-ref',
        orderings: [{ field: 'document.id' }],
        graphQuery: '{ articles { title } }',
      })
    ).toEqual({});
  });

  it('caps pageSize', () => {
    expect(parseClientSideListParams({ pageSize: 1000 })).toEqual({
      pageSize: maxPageSize,
    });
  });

  it('ignores page and pageSize unless they are positive integers', () => {
    expect(parseClientSideListParams({ page: '2', pageSize: -1 })).toEqual({});
  });

  it('wraps a single filter string in a list', () => {
    expect(parseClientSideListParams({ filters: 'test-filter' })).toEqual({
      filters: ['test-filter'],
    });
  });

  it('rejects filters that are not strings', () => {
    expect(
      parseClientSideListParams({ filters: [{ field: 'test' }] })
    ).toBeUndefined();
  });

  it('rejects params that are not an object', () => {
    expect(parseClientSideListParams(['test'])).toBeUndefined();
    expect(parseClientSideListParams(null)).toBeUndefined();
    expect(parseClientSideListParams('test')).toBeUndefined();
  });
});

describe('parseClientSideDocumentIds', () => {
  it('returns a list of string IDs', () => {
    expect(parseClientSideDocumentIds(['TestId1', 'TestId2'])).toEqual([
      'TestId1',
      'TestId2',
    ]);
  });

  it('rejects anything else', () => {
    expect(parseClientSideDocumentIds({ ids: ['TestId1'] })).toBeUndefined();
    expect(parseClientSideDocumentIds(['TestId1', 2])).toBeUndefined();
    expect(
      parseClientSideDocumentIds(Array(maxPageSize + 1).fill('TestId1'))
    ).toBeUndefined();
  });
});
