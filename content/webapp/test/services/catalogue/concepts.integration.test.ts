import { getConcepts } from '@weco/content/services/wellcome/catalogue/concepts';
import { catalogueQuery } from '@weco/content/services/wellcome/catalogue';
import { conceptsApiResponse, concept } from '@weco/content/test/fixtures/catalogueApi/concept';

// Mock the catalogueQuery function for integration testing
jest.mock('@weco/content/services/wellcome/catalogue', () => ({
  ...jest.requireActual('@weco/content/services/wellcome/catalogue'),
  catalogueQuery: jest.fn(),
}));

const mockCatalogueQuery = catalogueQuery as jest.MockedFunction<typeof catalogueQuery>;

describe('Concepts API Service Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getConcepts with query parameters', () => {
    it('integrates correctly with catalogueQuery for search queries', async () => {
      const mockResponse = {
        ...conceptsApiResponse,
        totalResults: 5,
        results: [
          { ...concept, id: 'concept1', label: 'Medicine' },
          { ...concept, id: 'concept2', label: 'Medical History' },
          { ...concept, id: 'concept3', label: 'Medical Research' },
        ],
        _requestUrl: 'https://api.wellcomecollection.org/catalogue/v2/concepts?query=medicine&page=1',
      };
      
      mockCatalogueQuery.mockResolvedValue(mockResponse);

      const props = {
        params: { 
          query: 'medicine',
          page: 1 
        },
        toggles: { conceptsSearch: true },
        pageSize: 25,
      };

      const result = await getConcepts(props);

      expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
      expect(result).toEqual(mockResponse);
      expect(result.totalResults).toBe(5);
      expect(result.results).toHaveLength(3);
      expect(result._requestUrl).toContain('query=medicine');
    });

    it('handles pagination correctly in search queries', async () => {
      const mockResponse = {
        ...conceptsApiResponse,
        totalResults: 100,
        totalPages: 4,
        results: [
          { ...concept, id: 'concept26', label: 'Advanced Medicine' },
          { ...concept, id: 'concept27', label: 'Clinical Medicine' },
        ],
        prevPage: 'https://api.wellcomecollection.org/catalogue/v2/concepts?query=medicine&page=1',
        nextPage: 'https://api.wellcomecollection.org/catalogue/v2/concepts?query=medicine&page=3',
        _requestUrl: 'https://api.wellcomecollection.org/catalogue/v2/concepts?query=medicine&page=2',
      };
      
      mockCatalogueQuery.mockResolvedValue(mockResponse);

      const props = {
        params: { 
          query: 'medicine',
          page: 2 
        },
        toggles: { conceptsSearch: true },
        pageSize: 25,
      };

      const result = await getConcepts(props);

      expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
      expect(result.totalPages).toBe(4);
      expect(result.prevPage).toBeTruthy();
      expect(result.nextPage).toBeTruthy();
      expect(result._requestUrl).toContain('page=2');
    });

    it('handles empty search results correctly', async () => {
      const mockResponse = {
        ...conceptsApiResponse,
        totalResults: 0,
        totalPages: 0,
        results: [],
        prevPage: null,
        nextPage: null,
        _requestUrl: 'https://api.wellcomecollection.org/catalogue/v2/concepts?query=nonexistent',
      };
      
      mockCatalogueQuery.mockResolvedValue(mockResponse);

      const props = {
        params: { 
          query: 'nonexistent',
          page: 1 
        },
        toggles: { conceptsSearch: true },
        pageSize: 25,
      };

      const result = await getConcepts(props);

      expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
      expect(result.totalResults).toBe(0);
      expect(result.results).toHaveLength(0);
      expect(result.prevPage).toBeNull();
      expect(result.nextPage).toBeNull();
    });

    it('handles API errors correctly', async () => {
      const mockError = {
        type: 'Error' as const,
        errorType: 'http' as const,
        httpStatus: 500,
        label: 'Internal Server Error',
        description: 'The concepts API is currently unavailable',
      };
      
      mockCatalogueQuery.mockResolvedValue(mockError);

      const props = {
        params: { 
          query: 'test',
          page: 1 
        },
        toggles: { conceptsSearch: true },
        pageSize: 25,
      };

      const result = await getConcepts(props);

      expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
      expect(result.type).toBe('Error');
      expect(result.httpStatus).toBe(500);
      expect(result.label).toBe('Internal Server Error');
    });

    it('handles special characters in search queries', async () => {
      const mockResponse = {
        ...conceptsApiResponse,
        results: [
          { ...concept, id: 'concept1', label: 'DNA & RNA Research' },
        ],
        _requestUrl: 'https://api.wellcomecollection.org/catalogue/v2/concepts?query=DNA%20%26%20RNA',
      };
      
      mockCatalogueQuery.mockResolvedValue(mockResponse);

      const props = {
        params: { 
          query: 'DNA & RNA',
          page: 1 
        },
        toggles: { conceptsSearch: true },
        pageSize: 25,
      };

      const result = await getConcepts(props);

      expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
      expect(result.results[0].label).toBe('DNA & RNA Research');
      expect(result._requestUrl).toContain('DNA%20%26%20RNA');
    });

    it('handles different page sizes correctly', async () => {
      const mockResponse = {
        ...conceptsApiResponse,
        pageSize: 50,
        results: Array.from({ length: 50 }, (_, i) => ({
          ...concept,
          id: `concept${i + 1}`,
          label: `Concept ${i + 1}`,
        })),
        _requestUrl: 'https://api.wellcomecollection.org/catalogue/v2/concepts?query=test&pageSize=50',
      };
      
      mockCatalogueQuery.mockResolvedValue(mockResponse);

      const props = {
        params: { 
          query: 'test',
          page: 1 
        },
        toggles: { conceptsSearch: true },
        pageSize: 50,
      };

      const result = await getConcepts(props);

      expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
      expect(result.pageSize).toBe(50);
      expect(result.results).toHaveLength(50);
    });
  });

  describe('getConcepts without query parameters', () => {
    it('integrates correctly for browsing concepts without search', async () => {
      const mockResponse = {
        ...conceptsApiResponse,
        totalResults: 1000,
        results: [
          { ...concept, id: 'concept1', label: 'Anatomy' },
          { ...concept, id: 'concept2', label: 'Biology' },
          { ...concept, id: 'concept3', label: 'Chemistry' },
        ],
        _requestUrl: 'https://api.wellcomecollection.org/catalogue/v2/concepts?page=1',
      };
      
      mockCatalogueQuery.mockResolvedValue(mockResponse);

      const props = {
        params: { page: 1 },
        toggles: { conceptsSearch: true },
        pageSize: 25,
      };

      const result = await getConcepts(props);

      expect(mockCatalogueQuery).toHaveBeenCalledWith('concepts', props);
      expect(result.totalResults).toBe(1000);
      expect(result.results).toHaveLength(3);
      expect(result._requestUrl).not.toContain('query=');
    });
  });
});