import { wellcomeApiQuery } from '@weco/content/services/wellcome';
import {
  getWork,
  getWorks,
} from '@weco/content/services/wellcome/catalogue/works';

// Mock the wellcomeApiQuery function so we can inspect the URLs we query
jest.mock('@weco/content/services/wellcome', () => ({
  ...jest.requireActual('@weco/content/services/wellcome'),
  wellcomeApiQuery: jest.fn(),
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

  it('doesn’t override an explicit elasticCluster param', async () => {
    await getWorks({
      params: { query: 'sheep', elasticCluster: 'openai' },
      pipelineCluster: 'axiell-collections-testing',
    });

    const [url] = mockWellcomeApiQuery.mock.calls[0];
    expect(url).toContain('elasticCluster=openai');
    expect(url).not.toContain('axiell-collections-testing');
  });
});
