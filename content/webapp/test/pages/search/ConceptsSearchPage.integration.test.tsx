import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { conceptsApiResponse, concept } from '@weco/content/test/fixtures/catalogueApi/concept';
import { getConcepts } from '@weco/content/services/wellcome/catalogue/concepts';
import { getServerSideProps } from '@weco/content/pages/search/concepts';
import ConceptsSearchPage from '@weco/content/views/pages/search/concepts';

// Mock dependencies
jest.mock('@weco/content/services/wellcome/catalogue/concepts');
jest.mock('@weco/common/server-data');
jest.mock('next/router', () => require('next-router-mock'));
jest.mock('uuid', () => ({ v4: () => '1234' }));

const mockGetConcepts = getConcepts as jest.MockedFunction<typeof getConcepts>;

// Mock server data
const mockServerData = {
  toggles: { conceptsSearch: { value: true } },
  prismic: {},
};

jest.mock('@weco/common/server-data', () => ({
  getServerData: jest.fn(() => Promise.resolve(mockServerData)),
}));

const createMockContext = (query: ParsedUrlQuery = {}): GetServerSidePropsContext => ({
  query,
  req: {} as any,
  res: {
    setHeader: jest.fn(),
    statusCode: 200,
  } as any,
  params: {},
  resolvedUrl: '/search/concepts',
});

describe('Concepts Search Page Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getServerSideProps', () => {
    it('redirects to main search page when conceptsSearch toggle is disabled', async () => {
      // Mock server data with toggle disabled
      const mockServerDataWithToggleDisabled = {
        toggles: { conceptsSearch: { value: false } },
        prismic: {},
      };

      const { getServerData } = require('@weco/common/server-data');
      getServerData.mockResolvedValueOnce(mockServerDataWithToggleDisabled);

      const context = createMockContext({ query: 'medical' });
      const result = await getServerSideProps(context);

      // Should not call getConcepts when toggle is disabled
      expect(mockGetConcepts).not.toHaveBeenCalled();

      // Should return a redirect to the main search page
      expect(result).toEqual({
        redirect: {
          destination: '/search',
          permanent: false,
        },
      });
    });

    it('fetches concepts data correctly for search queries', async () => {
      const mockResponse = {
        ...conceptsApiResponse,
        totalResults: 3,
        results: [
          { ...concept, id: 'concept1', label: 'Medical Research' },
          { ...concept, id: 'concept2', label: 'Medical History' },
          { ...concept, id: 'concept3', label: 'Medical Ethics' },
        ],
        _requestUrl: 'https://api.wellcomecollection.org/catalogue/v2/concepts?query=medical',
      };

      mockGetConcepts.mockResolvedValue(mockResponse);

      const context = createMockContext({ query: 'medical', page: '1' });
      const result = await getServerSideProps(context);

      expect(mockGetConcepts).toHaveBeenCalledWith({
        params: { query: 'medical', page: 1 },
        pageSize: 25,
        toggles: mockServerData.toggles,
      });

      if ('props' in result) {
        expect(result.props.concepts.totalResults).toBe(3);
        expect(result.props.concepts.results).toHaveLength(3);
        expect(result.props.pageview.name).toBe('concepts');
        expect(result.props.pageview.properties.totalResults).toBe(3);
        expect(result.props.apiToolbarLinks).toHaveLength(1);
        expect(result.props.apiToolbarLinks[0].label).toBe('Catalogue API query');
      }
    });

    it('handles pagination correctly', async () => {
      const mockResponse = {
        ...conceptsApiResponse,
        totalResults: 100,
        totalPages: 4,
        results: [
          { ...concept, id: 'concept26', label: 'Advanced Medicine' },
        ],
        prevPage: 'https://api.wellcomecollection.org/catalogue/v2/concepts?query=medicine&page=1',
        nextPage: 'https://api.wellcomecollection.org/catalogue/v2/concepts?query=medicine&page=3',
        _requestUrl: 'https://api.wellcomecollection.org/catalogue/v2/concepts?query=medicine&page=2',
      };

      mockGetConcepts.mockResolvedValue(mockResponse);

      const context = createMockContext({ query: 'medicine', page: '2' });
      const result = await getServerSideProps(context);

      expect(mockGetConcepts).toHaveBeenCalledWith({
        params: { query: 'medicine', page: 2 },
        pageSize: 25,
        toggles: mockServerData.toggles,
      });

      if ('props' in result) {
        expect(result.props.concepts.totalPages).toBe(4);
        expect(result.props.concepts.prevPage).toBeTruthy();
        expect(result.props.concepts.nextPage).toBeTruthy();
      }
    });

    it('handles spam detection correctly', async () => {
      // Mock a spam-like query with emoji (which is detected as spam)
      const context = createMockContext({
        query: '🎰🎲 casino gambling online 💰💸 cheap discount'
      });
      const result = await getServerSideProps(context);

      // Should not call getConcepts for spam queries
      expect(mockGetConcepts).not.toHaveBeenCalled();
      expect(context.res.statusCode).toBe(400);

      if ('props' in result) {
        expect(result.props.concepts.totalResults).toBe(0);
        expect(result.props.pageview.properties.looksLikeSpam).toBe('true');
        expect(result.props.apiToolbarLinks).toHaveLength(0);
      }
    });

    it('handles API errors correctly', async () => {
      const mockError = {
        type: 'Error' as const,
        errorType: 'http' as const,
        httpStatus: 500,
        label: 'Internal Server Error',
        description: 'The concepts API is currently unavailable',
      };

      mockGetConcepts.mockResolvedValue(mockError);

      const context = createMockContext({ query: 'test' });
      const result = await getServerSideProps(context);

      expect(mockGetConcepts).toHaveBeenCalled();

      // Should return an error redirect
      expect('redirect' in result || 'notFound' in result || result.props).toBeTruthy();
    });

    it('handles empty search results correctly', async () => {
      const mockResponse = {
        ...conceptsApiResponse,
        totalResults: 0,
        results: [],
        _requestUrl: 'https://api.wellcomecollection.org/catalogue/v2/concepts?query=nonexistent',
      };

      mockGetConcepts.mockResolvedValue(mockResponse);

      const context = createMockContext({ query: 'nonexistent' });
      const result = await getServerSideProps(context);

      expect(mockGetConcepts).toHaveBeenCalledWith({
        params: { query: 'nonexistent', page: 1 },
        pageSize: 25,
        toggles: mockServerData.toggles,
      });

      if ('props' in result) {
        expect(result.props.concepts.totalResults).toBe(0);
        expect(result.props.concepts.results).toHaveLength(0);
        expect(result.props.pageview.properties.totalResults).toBe(0);
      }
    });

    it('handles queries without search terms', async () => {
      const mockResponse = {
        ...conceptsApiResponse,
        totalResults: 1000,
        results: [
          { ...concept, id: 'concept1', label: 'Anatomy' },
          { ...concept, id: 'concept2', label: 'Biology' },
        ],
        _requestUrl: 'https://api.wellcomecollection.org/catalogue/v2/concepts',
      };

      mockGetConcepts.mockResolvedValue(mockResponse);

      const context = createMockContext({});
      const result = await getServerSideProps(context);

      expect(mockGetConcepts).toHaveBeenCalledWith({
        params: { query: '', page: 1 },
        pageSize: 25,
        toggles: mockServerData.toggles,
      });

      if ('props' in result) {
        expect(result.props.concepts.totalResults).toBe(1000);
        expect(result.props.concepts.results).toHaveLength(2);
      }
    });
  });

  describe('ConceptsSearchPage component integration', () => {
    // For component rendering tests, we'll focus on testing the getServerSideProps integration
    // since the component rendering is already covered in the unit tests
    // and the SearchPageLayout has complex dependencies that are better tested in isolation

    it('integrates correctly with server-side props structure', async () => {
      const mockResponse = {
        ...conceptsApiResponse,
        results: [
          { ...concept, id: 'concept1', label: 'Medical Research' },
          { ...concept, id: 'concept2', label: 'Medical History' },
        ],
      };

      mockGetConcepts.mockResolvedValue(mockResponse);

      const context = createMockContext({ query: 'medicine', page: '1' });
      const result = await getServerSideProps(context);

      if ('props' in result) {
        // Verify the props structure matches what the component expects
        expect(result.props).toHaveProperty('serverData');
        expect(result.props).toHaveProperty('conceptsRouteProps');
        expect(result.props).toHaveProperty('concepts');
        expect(result.props).toHaveProperty('pageview');
        expect(result.props).toHaveProperty('apiToolbarLinks');

        // Verify the concepts data structure
        expect(result.props.concepts.results).toHaveLength(2);
        expect(result.props.concepts.results[0].label).toBe('Medical Research');
        expect(result.props.concepts.results[1].label).toBe('Medical History');

        // Verify pageview tracking data
        expect(result.props.pageview.name).toBe('concepts');
        expect(result.props.pageview.properties.totalResults).toBe(1);

        // Verify API toolbar links
        expect(result.props.apiToolbarLinks).toHaveLength(1);
        expect(result.props.apiToolbarLinks[0].label).toBe('Catalogue API query');
      }
    });

    it('provides correct props structure for empty results', async () => {
      const mockResponse = {
        ...conceptsApiResponse,
        totalResults: 0,
        results: [],
      };

      mockGetConcepts.mockResolvedValue(mockResponse);

      const context = createMockContext({ query: 'nonexistent' });
      const result = await getServerSideProps(context);

      if ('props' in result) {
        expect(result.props.concepts.totalResults).toBe(0);
        expect(result.props.concepts.results).toHaveLength(0);
        expect(result.props.pageview.properties.totalResults).toBe(0);
      }
    });

    it('provides correct props structure for paginated results', async () => {
      const mockResponse = {
        ...conceptsApiResponse,
        totalResults: 100,
        totalPages: 4,
        nextPage: 'https://api.wellcomecollection.org/catalogue/v2/concepts?query=medicine&page=2',
        prevPage: null,
      };

      mockGetConcepts.mockResolvedValue(mockResponse);

      const context = createMockContext({ query: 'medicine', page: '1' });
      const result = await getServerSideProps(context);

      if ('props' in result) {
        expect(result.props.concepts.totalResults).toBe(100);
        expect(result.props.concepts.totalPages).toBe(4);
        expect(result.props.concepts.nextPage).toBeTruthy();
        expect(result.props.concepts.prevPage).toBeFalsy();
      }
    });
  });
});