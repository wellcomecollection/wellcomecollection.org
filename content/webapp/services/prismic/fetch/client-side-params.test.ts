import {
  maxPageSize,
  parseClientSideDocumentIds,
  parseClientSideListParams,
  parsePageSize,
} from './client-side-params';

const asParam = (value: unknown) => JSON.stringify(value);

describe('parseClientSideListParams', () => {
  it('keeps page, pageSize and filters', () => {
    expect(
      parseClientSideListParams(
        asParam({
          page: 2,
          pageSize: 5,
          filters: ['[at(my.articles.series.series, "test-series")]'],
        })
      )
    ).toEqual({
      page: 2,
      pageSize: 5,
      filters: ['[at(my.articles.series.series, "test-series")]'],
    });
  });

  it('drops any other options', () => {
    expect(
      parseClientSideListParams(
        asParam({
          ref: 'test-ref',
          orderings: [{ field: 'document.id' }],
          graphQuery: '{ articles { title } }',
        })
      )
    ).toEqual({});
  });

  it('caps pageSize', () => {
    expect(parseClientSideListParams(asParam({ pageSize: 1000 }))).toEqual({
      pageSize: maxPageSize,
    });
  });

  it('ignores page and pageSize unless they are positive integers', () => {
    expect(
      parseClientSideListParams(asParam({ page: 1.5, pageSize: -1 }))
    ).toEqual({});
  });

  it('wraps a single filter string in a list', () => {
    expect(
      parseClientSideListParams(asParam({ filters: 'test-filter' }))
    ).toEqual({ filters: ['test-filter'] });
  });

  it('rejects filters that are not strings', () => {
    expect(
      parseClientSideListParams(asParam({ filters: [{ field: 'test' }] }))
    ).toBeUndefined();
  });

  it('rejects params that are not a JSON object', () => {
    expect(parseClientSideListParams(asParam(['test']))).toBeUndefined();
    expect(parseClientSideListParams(asParam(null))).toBeUndefined();
    expect(parseClientSideListParams('not json')).toBeUndefined();
    expect(parseClientSideListParams(undefined)).toBeUndefined();
    expect(parseClientSideListParams(['{}', '{}'])).toBeUndefined();
  });
});

describe('parseClientSideDocumentIds', () => {
  it('returns a list of string IDs', () => {
    expect(parseClientSideDocumentIds(asParam(['TestId1', 'TestId2']))).toEqual(
      ['TestId1', 'TestId2']
    );
  });

  it('rejects anything else', () => {
    expect(
      parseClientSideDocumentIds(asParam({ ids: ['TestId1'] }))
    ).toBeUndefined();
    expect(parseClientSideDocumentIds(asParam(['TestId1', 2]))).toBeUndefined();
    expect(
      parseClientSideDocumentIds(
        asParam(Array(maxPageSize + 1).fill('TestId1'))
      )
    ).toBeUndefined();
    expect(parseClientSideDocumentIds('not json')).toBeUndefined();
  });
});

describe('parsePageSize', () => {
  it('accepts numbers and numeric strings, capped at the maximum', () => {
    expect(parsePageSize(16)).toBe(16);
    expect(parsePageSize('16')).toBe(16);
    expect(parsePageSize('1000')).toBe(maxPageSize);
  });

  it('ignores anything that is not a positive integer', () => {
    expect(parsePageSize('test')).toBeUndefined();
    expect(parsePageSize(0)).toBeUndefined();
    expect(parsePageSize(undefined)).toBeUndefined();
  });
});
