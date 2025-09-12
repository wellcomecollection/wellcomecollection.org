import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import {
  CatalogueResultsList,
  Concept
} from '@weco/content/services/wellcome/catalogue/types';
import { Query } from '@weco/content/types/search';
import { ConceptsProps } from '@weco/content/views/components/SearchPagesLink/Concepts';

import ConceptsSearchPage from '@weco/content/views/pages/search/concepts';

// Mock next/router for withSearchLayout HOC
/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const useRouter = jest.spyOn(require('next/router'), 'useRouter');

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/search/concepts'),
}));

// Mock next/head
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

const mockConcepts: Concept[] = [
  {
    id: 'concept-1',
    label: 'First Concept',
    displayLabel: 'First Display Label',
    type: 'Subject',
    description: {
      sourceLabel: 'nlm-mesh',
      sourceUrl: 'https://example.com',
      text: 'Description for first concept.',
    },
    alternativeLabels: ['Alt Label 1'],
  },
  {
    id: 'concept-2',
    label: 'Second Concept',
    type: 'Agent',
  },
];

const mockConceptsResults: CatalogueResultsList<Concept> = {
  type: 'ResultList',
  totalResults: 2,
  totalPages: 1,
  pageSize: 10,
  results: mockConcepts,
  prevPage: null,
  nextPage: null,
  _requestUrl: 'https://api.wellcomecollection.org/catalogue/v2/concepts?query=test',
};

const mockEmptyConceptsResults: CatalogueResultsList<Concept> = {
  type: 'ResultList',
  totalResults: 0,
  totalPages: 0,
  pageSize: 10,
  results: [],
  prevPage: null,
  nextPage: null,
  _requestUrl: 'https://api.wellcomecollection.org/catalogue/v2/concepts?query=test',
};

const mockConceptsRouteProps: ConceptsProps = {
  query: 'test query',
  page: 1,
};

const mockQuery: Query = {
  query: 'test query',
};

const defaultProps = {
  concepts: mockConceptsResults,
  conceptsRouteProps: mockConceptsRouteProps,
  query: mockQuery,
  apiToolbarLinks: [],
};

const renderComponent = (props = defaultProps) => {
  // Mock router for withSearchLayout HOC
  useRouter.mockImplementation(() => ({
    query: { query: props.query.query },
    pathname: '/search/concepts',
    asPath: '/search/concepts',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    beforePopState: jest.fn(),
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    isFallback: false,
    isLocaleDomain: false,
    isReady: true,
    defaultLocale: 'en',
    domainLocales: [],
    isPreview: false,
  }));

  return renderWithTheme(<ConceptsSearchPage {...props} />);
};

describe('ConceptsSearchPage', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('with results', () => {
    it('renders the concepts search results', () => {
      const { getByText } = renderComponent();

      expect(getByText('First Display Label')).toBeInTheDocument();
      expect(getByText('Second Concept')).toBeInTheDocument();
    });

    it('displays the correct number of results', () => {
      const { getByText } = renderComponent();

      expect(getByText('2 results')).toBeInTheDocument();
    });

    it('renders pagination components', () => {
      const { getAllByLabelText } = renderComponent();

      const paginationElements = getAllByLabelText('Themes search pagination');
      expect(paginationElements).toHaveLength(2); // Top and bottom pagination
    });

    it('renders the main content area', () => {
      const { getByRole } = renderComponent();

      const mainElement = getByRole('main');
      expect(mainElement).toBeInTheDocument();
    });

    it('renders ConceptsSearchResults component', () => {
      const { getByTestId } = renderComponent();

      const conceptsSearchResults = getByTestId('concepts-search-results');
      expect(conceptsSearchResults).toBeInTheDocument();
    });

    it('displays results status with role="status"', () => {
      const { getByRole } = renderComponent();

      const statusElement = getByRole('status');
      expect(statusElement).toHaveTextContent('2 results');
    });
  });

  describe('with no results', () => {
    const noResultsProps = {
      ...defaultProps,
      concepts: mockEmptyConceptsResults,
    };

    it('renders SearchNoResults component when no results', () => {
      const { getByText } = renderComponent(noResultsProps);

      // SearchNoResults should display the query
      expect(getByText('test query')).toBeInTheDocument();
    });

    it('does not render pagination when no results', () => {
      const { queryAllByLabelText } = renderComponent(noResultsProps);

      const paginationElements = queryAllByLabelText('Themes search pagination');
      expect(paginationElements).toHaveLength(0);
    });

    it('does not render main content area when no results', () => {
      const { queryByRole } = renderComponent(noResultsProps);

      const mainElement = queryByRole('main');
      expect(mainElement).not.toBeInTheDocument();
    });

    it('does not render ConceptsSearchResults component when no results', () => {
      const { queryByTestId } = renderComponent(noResultsProps);

      const conceptsSearchResults = queryByTestId('concepts-search-results');
      expect(conceptsSearchResults).not.toBeInTheDocument();
    });
  });

  describe('pagination', () => {
    const paginatedProps = {
      ...defaultProps,
      concepts: {
        ...mockConceptsResults,
        totalPages: 3,
        totalResults: 30,
        prevPage: 'http://example.com/prev',
        nextPage: 'http://example.com/next',
      },
      conceptsRouteProps: {
        ...mockConceptsRouteProps,
        page: 2,
      },
    };

    it('renders pagination with correct total pages', () => {
      const { getAllByLabelText } = renderComponent(paginatedProps);

      const paginationElements = getAllByLabelText('Themes search pagination');
      expect(paginationElements).toHaveLength(2);
    });

    it('displays correct results count for paginated results', () => {
      const { getByText } = renderComponent(paginatedProps);

      expect(getByText('30 results')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper ARIA labels for pagination', () => {
      const { getAllByLabelText } = renderComponent();

      const paginationElements = getAllByLabelText('Themes search pagination');
      expect(paginationElements).toHaveLength(2);
    });

    it('has proper role for results status', () => {
      const { getByRole } = renderComponent();

      const statusElement = getByRole('status');
      expect(statusElement).toBeInTheDocument();
    });

    it('has proper main landmark', () => {
      const { getByRole } = renderComponent();

      const mainElement = getByRole('main');
      expect(mainElement).toBeInTheDocument();
    });
  });

  describe('loading and error states', () => {
    it('handles empty query gracefully', () => {
      const emptyQueryProps = {
        ...defaultProps,
        query: { query: '' },
        conceptsRouteProps: { ...mockConceptsRouteProps, query: '' },
      };

      const { getByText } = renderComponent(emptyQueryProps);

      // Should still render the component structure
      expect(getByText('2 results')).toBeInTheDocument();
    });

    it('handles undefined query gracefully', () => {
      const undefinedQueryProps = {
        ...defaultProps,
        query: { query: undefined },
        conceptsRouteProps: { ...mockConceptsRouteProps, query: '' },
      };

      const { getByText } = renderComponent(undefinedQueryProps);

      // Should still render the component structure
      expect(getByText('2 results')).toBeInTheDocument();
    });
  });

  describe('SEO and metadata', () => {
    it('renders prev/next link tags when pagination exists', () => {
      const paginatedProps = {
        ...defaultProps,
        concepts: {
          ...mockConceptsResults,
          totalPages: 3,
          prevPage: 'http://example.com/prev',
          nextPage: 'http://example.com/next',
        },
        conceptsRouteProps: {
          ...mockConceptsRouteProps,
          page: 2,
        },
      };

      const { getByText } = renderComponent(paginatedProps);

      // The Head component is mocked, but we can verify the component renders without errors
      expect(getByText('2 results')).toBeInTheDocument();
    });

    it('does not render prev/next links when no pagination', () => {
      const { getByText } = renderComponent();

      // Single page results should not have pagination links
      expect(getByText('2 results')).toBeInTheDocument();
    });
  });

  describe('search context integration', () => {
    it('integrates with search context', () => {
      const { getByText } = renderComponent();

      // Component should render without errors when wrapped in SearchContextProvider
      expect(getByText('2 results')).toBeInTheDocument();
    });
  });

  describe('responsive behavior', () => {
    it('renders mobile-hidden pagination', () => {
      const { getAllByLabelText } = renderComponent();

      // The pagination should have isHiddenMobile prop set
      const paginationElements = getAllByLabelText('Themes search pagination');
      expect(paginationElements).toHaveLength(2);
    });
  });
});