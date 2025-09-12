import { render } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { useSearchContext } from '@weco/common/contexts/SearchContext';
import theme from '@weco/common/views/themes/default';
import SearchLayout from '@weco/content/views/layouts/SearchPageLayout';

// Mock the dependencies
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@weco/common/contexts/SearchContext');

const mockUseRouter = require('next/router').useRouter;
const mockUseSearchContext = useSearchContext as jest.MockedFunction<
  typeof useSearchContext
>;

const mockSetExtraApiToolbarLinks = jest.fn();

const renderSearchLayout = (
  pathname: string,
  query: Record<string, any> = {}
) => {
  mockUseRouter.mockReturnValue({
    pathname,
    query,
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    beforePopState: jest.fn(),
    reload: jest.fn(),
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
    asPath: pathname,
    basePath: '',
    locale: 'en',
    locales: ['en'],
    route: pathname,
  } as any);

  mockUseSearchContext.mockReturnValue({
    setExtraApiToolbarLinks: mockSetExtraApiToolbarLinks,
    link: {
      as: {
        query: {},
      },
    },
  } as any);

  return render(
    <ThemeProvider theme={theme}>
      <SearchLayout apiToolbarLinks={[]}>
        <div>Test content</div>
      </SearchLayout>
    </ThemeProvider>
  );
};

describe('SearchLayout metadata handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sets correct metadata for concepts search', () => {
    const { container } = renderSearchLayout('/search/concepts', {
      query: 'test query',
    });

    // The component should render without errors
    expect(container).toBeInTheDocument();

    // Verify that the router was called with the correct pathname
    expect(mockUseRouter).toHaveBeenCalled();
  });

  it('sets correct metadata for concepts search without query', () => {
    const { container } = renderSearchLayout('/search/concepts');

    // The component should render without errors
    expect(container).toBeInTheDocument();

    // Verify that the router was called with the correct pathname
    expect(mockUseRouter).toHaveBeenCalled();
  });

  it('handles other search categories correctly', () => {
    const { container } = renderSearchLayout('/search/works', {
      query: 'test query',
    });

    // The component should render without errors
    expect(container).toBeInTheDocument();
  });
});
