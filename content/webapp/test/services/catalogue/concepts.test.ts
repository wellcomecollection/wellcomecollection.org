import { wellcomeApiFetch } from '@weco/content/services/wellcome';
import { catalogueQuery } from '@weco/content/services/wellcome/catalogue';
import {
  conceptsApiUrl,
  getConcept,
  getConcepts,
  getConceptsByIds,
} from '@weco/content/services/wellcome/catalogue/concepts';
import { conceptsApiResponse } from '@weco/content/test/fixtures/catalogueApi/concept';

jest.mock('@weco/content/services/wellcome', () => ({
  ...jest.requireActual('@weco/content/services/wellcome'),
  wellcomeApiFetch: jest.fn(),
}));

const mockWellcomeApiFetch = wellcomeApiFetch as jest.MockedFunction<
  typeof wellcomeApiFetch
>;

// Mock the catalogueQuery function
jest.mock('@weco/content/services/wellcome/catalogue', () => ({
  ...jest.requireActual('@weco/content/services/wellcome/catalogue'),
  catalogueQuery: jest.fn(),
}));

const mockCatalogueQuery = catalogueQuery as jest.MockedFunction<
  typeof catalogueQuery
>;

describe('conceptsApiUrl', () => {
  it('leaves out unset params', () => {
    expect(conceptsApiUrl('/abc123', { elasticCluster: undefined })).toBe(
      'https://api.wellcomecollection.org/catalogue/v2/concepts/abc123'
    );
  });

  it('adds set params to the given root', () => {
    const url = new URL(
      conceptsApiUrl(
        '',
        { id: 'a,b', elasticCluster: 'pipeline-2026-09-30' },
        'https://api-stage.wellcomecollection.org'
      )
    );
    expect(url.origin).toBe('https://api-stage.wellcomecollection.org');
    expect(url.pathname).toBe('/catalogue/v2/concepts');
    expect(url.searchParams.get('id')).toBe('a,b');
    expect(url.searchParams.get('elasticCluster')).toBe('pipeline-2026-09-30');
  });
});

describe('getConcept', () => {
  it('returns a 404 Not Found for a concept ID that is not alphanumeric', () => {
    const id = 'a\u200Bb';

    getConcept({ id, shouldUseStagingApi: false }).then(result => {
      expect(result).toStrictEqual({
        errorType: 'http',
        httpStatus: 404,
        label: 'Not Found',
        description: '',
        type: 'Error',
      });
    });
  });
});

describe('getConcept: the cataloguePipeline mode toggle', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWellcomeApiFetch.mockResolvedValue({
      status: 200,
      json: async () => ({}),
    } as Response);
  });

  it('adds no elasticCluster param when the mode is unset', async () => {
    await getConcept({ id: 'abc123' });

    const url = mockWellcomeApiFetch.mock.calls[0][0] as string;
    expect(url.endsWith('/catalogue/v2/concepts/abc123')).toBe(true);
  });

  it('adds an elasticCluster param when the mode is set', async () => {
    await getConcept({ id: 'abc123', pipelineCluster: 'pipeline-2026-09-30' });

    const url = new URL(mockWellcomeApiFetch.mock.calls[0][0] as string);
    expect(url.pathname).toBe('/catalogue/v2/concepts/abc123');
    expect(url.searchParams.get('elasticCluster')).toBe('pipeline-2026-09-30');
  });
});

describe('getConceptsByIds', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes the pipeline cluster through to catalogueQuery', async () => {
    mockCatalogueQuery.mockResolvedValue(conceptsApiResponse);

    await getConceptsByIds(['abc123'], false, 'pipeline-2026-09-30');

    expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', {
      params: { id: 'abc123' },
      shouldUseStagingApi: false,
      pipelineCluster: 'pipeline-2026-09-30',
    });
  });
});

describe('getConcepts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls catalogueQuery with correct endpoint and parameters when no query is provided', async () => {
    mockCatalogueQuery.mockResolvedValue(conceptsApiResponse);

    const props = {
      params: { page: 1 },
      shouldUseStagingApi: false,
      pageSize: 20,
    };

    await getConcepts(props);

    expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
  });

  it('calls catalogueQuery with correct endpoint and parameters when query is provided', async () => {
    mockCatalogueQuery.mockResolvedValue(conceptsApiResponse);

    const props = {
      params: { query: 'test search', page: 1 },
      shouldUseStagingApi: false,
      pageSize: 20,
    };

    await getConcepts(props);

    expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
  });

  it('returns the result from catalogueQuery', async () => {
    mockCatalogueQuery.mockResolvedValue(conceptsApiResponse);

    const props = {
      params: { query: 'test search' },
      shouldUseStagingApi: false,
      pageSize: 20,
    };

    const result = await getConcepts(props);

    expect(result).toEqual(conceptsApiResponse);
  });

  it('handles empty query parameter', async () => {
    mockCatalogueQuery.mockResolvedValue(conceptsApiResponse);

    const props = {
      params: { query: '' },
      shouldUseStagingApi: false,
      pageSize: 20,
    };

    await getConcepts(props);

    expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
  });

  it('handles query parameter with special characters', async () => {
    mockCatalogueQuery.mockResolvedValue(conceptsApiResponse);

    const props = {
      params: { query: 'test & search "with quotes"' },
      shouldUseStagingApi: false,
      pageSize: 20,
    };

    await getConcepts(props);

    expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
  });

  it('passes through pagination parameters correctly', async () => {
    mockCatalogueQuery.mockResolvedValue(conceptsApiResponse);

    const props = {
      params: { query: 'test', page: 3 },
      shouldUseStagingApi: false,
      pageSize: 50,
    };

    await getConcepts(props);

    expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
  });
});
