import { useRouter } from 'next/router';

import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { AppContextProvider } from '@weco/common/contexts/AppContext';
import SearchNavigation from '@weco/content/views/layouts/SearchPageLayout/SearchNavigation';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock the toggles context
jest.mock('@weco/common/server-data/Context', () => ({
  useToggles: jest.fn(),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseToggles = require('@weco/common/server-data/Context').useToggles as jest.MockedFunction<any>;

describe('Search Navigation Integration Tests', () => {
  const mockPush = jest.fn();
  const mockRouter = {
    push: mockPush,
    pathname: '/search/concepts',
    query: { query: 'medicine' },
    asPath: '/search/concepts?query=medicine',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue(mockRouter as any);
  });

  describe('Tab navigation with concepts enabled', () => {
    it('renders concepts tab when toggle is enabled', () => {
      mockUseToggles.mockReturnValue({ conceptsSearch: true });
      
      const mockServerData = {
        toggles: { conceptsSearch: true },
        prismic: {},
      };

      const { container } = renderWithTheme(
        <AppContextProvider serverData={mockServerData}>
          <SearchNavigation 
            currentSearchCategory="concepts" 
            currentQueryValue="medicine" 
          />
        </AppContextProvider>
      );

      // Check that concepts tab exists in the DOM
      const conceptsLinks = container.querySelectorAll('a[href*="/search/concepts"]');
      expect(conceptsLinks.length).toBeGreaterThan(0);
      
      // Check that the concepts tab has the correct text content
      const conceptsTab = Array.from(conceptsLinks).find(link => 
        link.textContent?.includes('Themes')
      );
      expect(conceptsTab).toBeTruthy();
    });

    it('highlights the concepts tab when on concepts search page', () => {
      mockUseToggles.mockReturnValue({ conceptsSearch: true });
      
      const mockServerData = {
        toggles: { conceptsSearch: true },
        prismic: {},
      };

      const { container } = renderWithTheme(
        <AppContextProvider serverData={mockServerData}>
          <SearchNavigation 
            currentSearchCategory="concepts" 
            currentQueryValue="medicine" 
          />
        </AppContextProvider>
      );

      // Find the concepts tab and check if it's marked as current
      const conceptsTab = container.querySelector('a[href*="/search/concepts"]');
      const currentElement = conceptsTab?.querySelector('[aria-current="page"]');
      expect(currentElement).toBeTruthy();
    });

    it('includes all expected search categories', () => {
      mockUseToggles.mockReturnValue({ conceptsSearch: true });
      
      const mockServerData = {
        toggles: { conceptsSearch: true },
        prismic: {},
      };

      const { container } = renderWithTheme(
        <AppContextProvider serverData={mockServerData}>
          <SearchNavigation 
            currentSearchCategory="concepts" 
            currentQueryValue="medicine" 
          />
        </AppContextProvider>
      );

      // Check for all expected search category links
      expect(container.querySelector('a[href*="/search"]')).toBeTruthy(); // All
      expect(container.querySelector('a[href*="/search/works"]')).toBeTruthy(); // Catalogue
      expect(container.querySelector('a[href*="/search/images"]')).toBeTruthy(); // Images
      expect(container.querySelector('a[href*="/search/concepts"]')).toBeTruthy(); // Concepts
      expect(container.querySelector('a[href*="/search/events"]')).toBeTruthy(); // Events
      expect(container.querySelector('a[href*="/search/stories"]')).toBeTruthy(); // Stories
    });
  });

  describe('Tab navigation with concepts disabled', () => {
    it('does not render concepts tab when toggle is disabled', () => {
      mockUseToggles.mockReturnValue({ conceptsSearch: false });
      
      const mockServerDataDisabled = {
        toggles: { conceptsSearch: false },
        prismic: {},
      };

      const { container } = renderWithTheme(
        <AppContextProvider serverData={mockServerDataDisabled}>
          <SearchNavigation 
            currentSearchCategory="works" 
            currentQueryValue="medicine" 
          />
        </AppContextProvider>
      );

      // Check that concepts tab does not exist
      const conceptsLinks = container.querySelectorAll('a[href*="/search/concepts"]');
      expect(conceptsLinks.length).toBe(0);
      
      // But other tabs should still exist
      expect(container.querySelector('a[href*="/search"]')).toBeTruthy(); // All
      expect(container.querySelector('a[href*="/search/works"]')).toBeTruthy(); // Catalogue
      expect(container.querySelector('a[href*="/search/images"]')).toBeTruthy(); // Images
      expect(container.querySelector('a[href*="/search/events"]')).toBeTruthy(); // Events
      expect(container.querySelector('a[href*="/search/stories"]')).toBeTruthy(); // Stories
    });
  });

  describe('Search form integration', () => {
    it('renders search form with correct structure', () => {
      mockUseToggles.mockReturnValue({ conceptsSearch: true });
      
      const mockServerData = {
        toggles: { conceptsSearch: true },
        prismic: {},
      };

      const { getByRole } = renderWithTheme(
        <AppContextProvider serverData={mockServerData}>
          <SearchNavigation 
            currentSearchCategory="concepts" 
            currentQueryValue="medicine" 
          />
        </AppContextProvider>
      );

      // Check that search form exists
      const searchForm = getByRole('search');
      expect(searchForm).toBeTruthy();
      
      // Check that search input exists
      const searchInput = getByRole('searchbox');
      expect(searchInput).toBeTruthy();
      expect((searchInput as HTMLInputElement).value).toBe('medicine');
    });

    it('updates input value when currentQueryValue changes', () => {
      mockUseToggles.mockReturnValue({ conceptsSearch: true });
      
      const mockServerData = {
        toggles: { conceptsSearch: true },
        prismic: {},
      };

      const { rerender, getByRole } = renderWithTheme(
        <AppContextProvider serverData={mockServerData}>
          <SearchNavigation 
            currentSearchCategory="concepts" 
            currentQueryValue="initial search" 
          />
        </AppContextProvider>
      );

      const searchInput = getByRole('searchbox') as HTMLInputElement;
      expect(searchInput.value).toBe('initial search');

      rerender(
        <AppContextProvider serverData={mockServerData}>
          <SearchNavigation 
            currentSearchCategory="concepts" 
            currentQueryValue="updated search" 
          />
        </AppContextProvider>
      );

      expect(searchInput.value).toBe('updated search');
    });
  });

  describe('URL generation integration', () => {
    it('generates correct URLs with query parameters', () => {
      mockUseToggles.mockReturnValue({ conceptsSearch: true });
      
      const mockServerData = {
        toggles: { conceptsSearch: true },
        prismic: {},
      };

      const { container } = renderWithTheme(
        <AppContextProvider serverData={mockServerData}>
          <SearchNavigation 
            currentSearchCategory="concepts" 
            currentQueryValue="test query" 
          />
        </AppContextProvider>
      );

      // Check that URLs include the query parameter
      const conceptsLink = container.querySelector('a[href*="/search/concepts"]');
      expect(conceptsLink?.getAttribute('href')).toContain('query=test query');
      
      const worksLink = container.querySelector('a[href*="/search/works"]');
      expect(worksLink?.getAttribute('href')).toContain('query=test query');
      
      const imagesLink = container.querySelector('a[href*="/search/images"]');
      expect(imagesLink?.getAttribute('href')).toContain('query=test query');
    });

    it('handles empty query correctly', () => {
      mockUseToggles.mockReturnValue({ conceptsSearch: true });
      
      const mockServerData = {
        toggles: { conceptsSearch: true },
        prismic: {},
      };

      const { container } = renderWithTheme(
        <AppContextProvider serverData={mockServerData}>
          <SearchNavigation 
            currentSearchCategory="concepts" 
            currentQueryValue="" 
          />
        </AppContextProvider>
      );

      // Check that URLs are generated even with empty query
      const conceptsLink = container.querySelector('a[href*="/search/concepts"]');
      expect(conceptsLink?.getAttribute('href')).toBeTruthy();
      
      const allLink = container.querySelector('a[href="/search"]');
      expect(allLink?.getAttribute('href')).toBe('/search');
    });
  });
});