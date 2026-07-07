import { wellcomeApiQuery } from '@weco/content/services/wellcome';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';

// Mock the wellcomeApiQuery function so we can inspect the URLs we query
jest.mock('@weco/content/services/wellcome', () => ({
  ...jest.requireActual('@weco/content/services/wellcome'),
  wellcomeApiQuery: jest.fn(),
}));

const mockWellcomeApiQuery = wellcomeApiQuery as jest.MockedFunction<
  typeof wellcomeApiQuery
>;

describe('getImages: the cataloguePipeline mode toggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWellcomeApiQuery.mockResolvedValue({
      type: 'ResultList',
      httpStatus: 200,
      _requestUrl: '',
    });
  });

  it('adds elasticCluster=<mode value> to the query when the mode is set', async () => {
    await getImages({
      params: { query: 'sheep' },
      pipelineCluster: 'new-pipeline',
    });

    const [url] = mockWellcomeApiQuery.mock.calls[0];
    expect(url).toContain('elasticCluster=new-pipeline');
  });

  it('doesn’t add elasticCluster to the query when the mode is unset', async () => {
    await getImages({ params: { query: 'sheep' } });

    const [url] = mockWellcomeApiQuery.mock.calls[0];
    expect(url).not.toContain('elasticCluster');
  });

  it('doesn’t add elasticCluster to the query when the mode is default', async () => {
    await getImages({ params: { query: 'sheep' }, pipelineCluster: 'default' });

    const [url] = mockWellcomeApiQuery.mock.calls[0];
    expect(url).not.toContain('elasticCluster');
  });

  it('doesn’t override an explicit elasticCluster param', async () => {
    await getImages({
      params: { query: 'sheep', elasticCluster: 'openai' },
      pipelineCluster: 'new-pipeline',
    });

    const [url] = mockWellcomeApiQuery.mock.calls[0];
    expect(url).toContain('elasticCluster=openai');
    expect(url).not.toContain('new-pipeline');
  });
});
