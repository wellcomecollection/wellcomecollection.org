import {
  wellcomeApiFetch,
  wellcomeApiQuery,
} from '@weco/content/services/wellcome';
import {
  getWork,
  getWorks,
} from '@weco/content/services/wellcome/catalogue/works';

// Mock the wellcomeApiQuery function so we can inspect the URLs we query
jest.mock('@weco/content/services/wellcome', () => ({
  ...jest.requireActual('@weco/content/services/wellcome'),
  wellcomeApiQuery: jest.fn(),
  wellcomeApiFetch: jest.fn(),
}));

const mockWellcomeApiQuery = wellcomeApiQuery as jest.MockedFunction<
  typeof wellcomeApiQuery
>;

it('returns a 404 Not Found for a work ID that’s not alphanumeric', () => {
  const id = 'a\u200Bb';

  getWork({ id, shouldUseStagingApi: false }).then(result => {
    expect(result).toStrictEqual({
      errorType: 'http',
      httpStatus: 404,
      label: 'Not Found',
      description: '',
      type: 'Error',
    });
  });
});

describe('getWork: API errors', () => {
  const mockWellcomeApiFetch = wellcomeApiFetch as jest.MockedFunction<
    typeof wellcomeApiFetch
  >;

  // jsdom has no Response, so this stands in for one
  const apiErrorResponse = (httpStatus: number) =>
    ({
      status: httpStatus,
      json: () =>
        Promise.resolve({
          type: 'Error',
          errorType: 'http',
          httpStatus,
          label: 'Error',
          description: '',
        }),
    }) as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns a 500 error, and logs it, when the request fails', async () => {
    mockWellcomeApiFetch.mockRejectedValue(new TypeError('fetch failed'));

    const result = await getWork({
      id: 'a2pjqhmz',
      shouldUseStagingApi: false,
    });

    expect(result).toMatchObject({ type: 'Error', httpStatus: 500 });
    expect(console.error).toHaveBeenCalled();
  });

  it('logs an API error', async () => {
    mockWellcomeApiFetch.mockResolvedValue(apiErrorResponse(500));

    const result = await getWork({
      id: 'a2pjqhmz',
      shouldUseStagingApi: false,
    });

    expect(result).toMatchObject({ type: 'Error', httpStatus: 500 });
    expect(console.warn).toHaveBeenCalled();
  });

  it('returns a 414 without logging it', async () => {
    mockWellcomeApiFetch.mockResolvedValue(apiErrorResponse(414));

    const result = await getWork({
      id: 'a2pjqhmz',
      shouldUseStagingApi: false,
    });

    expect(result).toMatchObject({ type: 'Error', httpStatus: 414 });
    expect(console.warn).not.toHaveBeenCalled();
  });
});

describe('getWorks: the cataloguePipeline mode toggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWellcomeApiQuery.mockResolvedValue({
      type: 'ResultList',
      httpStatus: 200,
      _requestUrl: '',
    });
  });

  it('adds elasticCluster=<mode value> to the query when the mode is set', async () => {
    await getWorks({
      params: { query: 'sheep' },
      pipelineCluster: 'axiell-collections-testing',
    });

    const [url] = mockWellcomeApiQuery.mock.calls[0];
    expect(url).toContain('elasticCluster=axiell-collections-testing');
  });

  it('doesn’t add elasticCluster to the query when the mode is unset', async () => {
    await getWorks({ params: { query: 'sheep' } });

    const [url] = mockWellcomeApiQuery.mock.calls[0];
    expect(url).not.toContain('elasticCluster');
  });
});
