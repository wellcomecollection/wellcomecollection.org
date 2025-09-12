import { catalogueQuery } from '@weco/content/services/wellcome/catalogue';
import {
  getConcept,
  getConcepts,
} from '@weco/content/services/wellcome/catalogue/concepts';
import { conceptsApiResponse } from '@weco/content/test/fixtures/catalogueApi/concept';

// Mock the catalogueQuery function
jest.mock('@weco/content/services/wellcome/catalogue', () => ({
  ...jest.requireActual('@weco/content/services/wellcome/catalogue'),
  catalogueQuery: jest.fn(),
}));

const mockCatalogueQuery = catalogueQuery as jest.MockedFunction<
  typeof catalogueQuery
>;

describe('getConcept', () => {
  it('returns a 404 Not Found for a concept ID that is not alphanumeric', () => {
    const id = 'a\u200Bb';

    getConcept({ id, toggles: {} }).then(result => {
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

describe('getConcepts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls catalogueQuery with correct endpoint and parameters when no query is provided', async () => {
    mockCatalogueQuery.mockResolvedValue(conceptsApiResponse);

    const props = {
      params: { page: 1 },
      toggles: {},
      pageSize: 20,
    };

    await getConcepts(props);

    expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
  });

  it('calls catalogueQuery with correct endpoint and parameters when query is provided', async () => {
    mockCatalogueQuery.mockResolvedValue(conceptsApiResponse);

    const props = {
      params: { query: 'test search', page: 1 },
      toggles: {},
      pageSize: 20,
    };

    await getConcepts(props);

    expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
  });

  it('returns the result from catalogueQuery', async () => {
    mockCatalogueQuery.mockResolvedValue(conceptsApiResponse);

    const props = {
      params: { query: 'test search' },
      toggles: {},
      pageSize: 20,
    };

    const result = await getConcepts(props);

    expect(result).toEqual(conceptsApiResponse);
  });

  it('handles empty query parameter', async () => {
    mockCatalogueQuery.mockResolvedValue(conceptsApiResponse);

    const props = {
      params: { query: '' },
      toggles: {},
      pageSize: 20,
    };

    await getConcepts(props);

    expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
  });

  it('handles query parameter with special characters', async () => {
    mockCatalogueQuery.mockResolvedValue(conceptsApiResponse);

    const props = {
      params: { query: 'test & search "with quotes"' },
      toggles: {},
      pageSize: 20,
    };

    await getConcepts(props);

    expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
  });

  it('passes through pagination parameters correctly', async () => {
    mockCatalogueQuery.mockResolvedValue(conceptsApiResponse);

    const props = {
      params: { query: 'test', page: 3 },
      toggles: {},
      pageSize: 50,
    };

    await getConcepts(props);

    expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
  });
});
