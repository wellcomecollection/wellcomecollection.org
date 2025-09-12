import { fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';

import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import ConceptsLink, { 
  toLink, 
  toQuery, 
  fromQuery, 
  emptyConceptsProps 
} from '@weco/content/views/components/SearchPagesLink/Concepts';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('Concepts Search Link Integration Tests', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
    pathname: '/search/concepts',
    query: {},
    asPath: '/search/concepts',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter as any);
  });

  describe('URL generation and routing', () => {
    it('generates correct URLs for concepts search with query', () => {
      const link = toLink({ query: 'medicine', page: 1 }, 'search_form');
      
      expect(link.href.pathname).toBe('/search/concepts');
      expect(link.href.query).toEqual(
        expect.objectContaining({
          query: 'medicine',
          source: 'search_form',
        })
      );
      expect(link.as.pathname).toBe('/search/concepts');
      expect(link.as.query).toEqual(
        expect.objectContaining({
          query: 'medicine',
        })
      );
    });

    it('generates correct URLs for concepts search without query', () => {
      const link = toLink({ page: 1 }, 'search_form');
      
      expect(link.href.pathname).toBe('/search/concepts');
      expect(link.href.query).toEqual(
        expect.objectContaining({
          source: 'search_form',
        })
      );
      expect(link.as.pathname).toBe('/search/concepts');
    });

    it('generates correct URLs for pagination', () => {
      const link = toLink({ query: 'medical research', page: 3 }, 'pagination');
      
      expect(link.href.pathname).toBe('/search/concepts');
      expect(link.href.query).toEqual(
        expect.objectContaining({
          query: 'medical research',
          source: 'pagination',
        })
      );
      expect(link.as.query).toEqual(
        expect.objectContaining({
          query: 'medical research',
        })
      );
    });

    it('handles empty partial props correctly', () => {
      const link = toLink({}, 'search_form');
      
      expect(link.href.query).toEqual(
        expect.objectContaining({
          source: 'search_form',
        })
      );
      expect(link.as.pathname).toBe('/search/concepts');
    });

    it('handles special characters in query correctly', () => {
      const link = toLink({ query: 'DNA & RNA research "genetics"', page: 1 }, 'search_form');
      
      expect(link.href.query.query).toBe('DNA & RNA research "genetics"');
      expect(link.as.query.query).toBe('DNA & RNA research "genetics"');
    });
  });

  describe('Query parameter encoding and decoding', () => {
    it('encodes query parameters correctly', () => {
      const props = { query: 'medical research', page: 2 };
      const encoded = toQuery(props);
      
      expect(encoded).toEqual(
        expect.objectContaining({
          query: 'medical research',
        })
      );
      // Page might be encoded as string or number depending on implementation
      expect(encoded.page).toBeTruthy();
    });

    it('decodes query parameters correctly', () => {
      const queryParams = { query: 'medical research', page: '2' };
      const decoded = fromQuery(queryParams);
      
      expect(decoded).toEqual({
        query: 'medical research',
        page: 2,
      });
    });

    it('handles missing query parameters with defaults', () => {
      const queryParams = {};
      const decoded = fromQuery(queryParams);
      
      expect(decoded).toEqual(emptyConceptsProps);
    });

    it('handles invalid page numbers correctly', () => {
      const queryParams = { query: 'test', page: 'invalid' };
      const decoded = fromQuery(queryParams);
      
      expect(decoded.page).toBe(1); // Should default to 1 for invalid page
      expect(decoded.query).toBe('test');
    });

    it('handles array query parameters correctly', () => {
      const queryParams = { query: ['first', 'second'], page: '1' };
      const decoded = fromQuery(queryParams);
      
      // Should handle array by taking first value or joining
      expect(typeof decoded.query).toBe('string');
      expect(decoded.page).toBe(1);
    });
  });

  describe('ConceptsLink component integration', () => {
    it('renders link with correct href attributes', () => {
      const { getByRole } = renderWithTheme(
        <ConceptsLink query="medicine" page={1} source="search_form">
          Search Concepts
        </ConceptsLink>
      );

      const link = getByRole('link');
      expect(link).toHaveAttribute('href', expect.stringContaining('/search/concepts'));
      expect(link.textContent).toBe('Search Concepts');
    });

    it('navigates correctly when clicked', () => {
      const { getByRole } = renderWithTheme(
        <ConceptsLink query="medicine" page={2} source="pagination">
          Next Page
        </ConceptsLink>
      );

      const link = getByRole('link');
      fireEvent.click(link);

      // Next.js Link component should handle navigation
      expect(link).toHaveAttribute('href', expect.stringContaining('page=2'));
      expect(link).toHaveAttribute('href', expect.stringContaining('query=medicine'));
    });

    it('handles empty query correctly', () => {
      const { getByRole } = renderWithTheme(
        <ConceptsLink query="" page={1} source="search_form">
          Browse Concepts
        </ConceptsLink>
      );

      const link = getByRole('link');
      expect(link).toHaveAttribute('href', expect.stringContaining('/search/concepts'));
      expect(link.textContent).toBe('Browse Concepts');
    });

    it('handles different source values correctly', () => {
      // Test that different source values generate valid links
      const sources = ['search_form', 'pagination', 'search_context'] as const;
      
      sources.forEach(source => {
        const link = toLink({ query: 'test', page: 1 }, source);
        expect(link.href.pathname).toBe('/search/concepts');
        expect(link.href.query).toEqual(
          expect.objectContaining({
            source: source,
          })
        );
      });
    });
  });

  describe('URL roundtrip consistency', () => {
    it('maintains consistency through encode/decode cycle', () => {
      const originalProps = { query: 'medical research', page: 3 };
      
      // Encode to query params
      const encoded = toQuery(originalProps);
      
      // Decode back to props
      const decoded = fromQuery(encoded);
      
      expect(decoded).toEqual(originalProps);
    });

    it('maintains consistency through link generation cycle', () => {
      const originalProps = { query: 'DNA research', page: 2 };
      
      // Generate link
      const link = toLink(originalProps, 'search_form');
      
      // Extract query params from link.as
      const decoded = fromQuery(link.as.query!);
      
      expect(decoded).toEqual(originalProps);
    });

    it('handles edge cases in roundtrip', () => {
      const edgeCases = [
        { query: '', page: 1 },
        { query: 'test with spaces', page: 1 },
        { query: 'special!@#$%^&*()chars', page: 10 },
        { query: 'unicode: 测试', page: 1 },
      ];

      edgeCases.forEach(props => {
        const encoded = toQuery(props);
        const decoded = fromQuery(encoded);
        expect(decoded).toEqual(props);
      });
    });
  });

  describe('Integration with browser navigation', () => {
    it('generates URLs compatible with browser back/forward navigation', () => {
      const searchStates = [
        { query: 'medicine', page: 1 },
        { query: 'medicine', page: 2 },
        { query: 'medical research', page: 1 },
        { query: '', page: 1 },
      ];

      searchStates.forEach(state => {
        const link = toLink(state, 'search_form');
        
        // Verify the URL structure is consistent
        expect(link.as.pathname).toBe('/search/concepts');
        if (link.as.query?.query !== undefined) {
          expect(typeof link.as.query.query).toBe('string');
        }
        
        // Verify it can be decoded back (allowing for encoding differences)
        const decoded = fromQuery(link.as.query!);
        expect(decoded.query).toBe(state.query);
        expect(decoded.page).toBe(state.page);
      });
    });

    it('handles URL sharing correctly', () => {
      const shareableState = { query: 'medical history', page: 2 };
      const link = toLink(shareableState, 'search_form');
      
      // Simulate sharing the URL (using link.as which is what appears in browser)
      const sharedUrl = `${link.as.pathname}?${new URLSearchParams(
        Object.entries(link.as.query!).map(([k, v]) => [k, String(v)])
      ).toString()}`;
      
      expect(sharedUrl).toContain('/search/concepts');
      expect(sharedUrl).toContain('query=medical+history');
      expect(sharedUrl).toContain('page=2');
    });
  });
});