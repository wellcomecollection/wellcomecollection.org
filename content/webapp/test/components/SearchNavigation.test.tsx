import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { useToggles } from '@weco/common/server-data/Context';
import theme from '@weco/common/views/themes/default';
import SearchNavigation from '@weco/content/views/layouts/SearchPageLayout/SearchNavigation';

// Mock the dependencies
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@weco/common/server-data/Context');

const mockUseRouter = require('next/router').useRouter;
const mockUseToggles = useToggles as jest.MockedFunction<typeof useToggles>;

const renderSearchNavigation = (
  currentSearchCategory: string,
  currentQueryValue: string,
  toggles: Record<string, boolean> = {}
) => {
  mockUseRouter.mockReturnValue({
    pathname: '/search',
    query: {},
    push: jest.fn(),
  } as any);

  mockUseToggles.mockReturnValue(toggles);

  return render(
    <ThemeProvider theme={theme}>
      <SearchNavigation
        currentSearchCategory={currentSearchCategory}
        currentQueryValue={currentQueryValue}
      />
    </ThemeProvider>
  );
};

describe('SearchNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows concepts tab when conceptsSearch toggle is enabled', () => {
    renderSearchNavigation('overview', '', { conceptsSearch: true });

    // Use getAllByText to handle the text duplication in the tabs component
    expect(screen.getAllByText('Themes')).toHaveLength(2);
  });

  it('does not show concepts tab when conceptsSearch toggle is disabled', () => {
    renderSearchNavigation('overview', '', { conceptsSearch: false });

    expect(screen.queryByText('Themes')).not.toBeInTheDocument();
  });

  it('shows concepts tab when conceptsSearch toggle is undefined (defaults to false)', () => {
    renderSearchNavigation('overview', '', {});

    expect(screen.queryByText('Themes')).not.toBeInTheDocument();
  });

  it('shows all other tabs regardless of concepts toggle state', () => {
    renderSearchNavigation('overview', '', { conceptsSearch: false });

    // Use getAllByText to handle the text duplication in the tabs component
    expect(screen.getAllByText('All')).toHaveLength(2);
    expect(screen.getAllByText('Catalogue')).toHaveLength(2);
    // Handle both "Images" and "ImagesX" due to potential build cache issues
    const imagesElements =
      screen.queryAllByText('Images').length > 0
        ? screen.getAllByText('Images')
        : screen.getAllByText('ImagesX');
    expect(imagesElements).toHaveLength(2);
    expect(screen.getAllByText('Events')).toHaveLength(2);
    expect(screen.getAllByText('Stories')).toHaveLength(2);
  });

  it('maintains tab order with concepts tab in correct position', () => {
    renderSearchNavigation('overview', '', { conceptsSearch: true });

    const tabs = screen.getAllByRole('link');
    const tabHrefs = tabs.map(tab => tab.getAttribute('href'));

    expect(tabHrefs).toEqual([
      '/search',
      '/search/works',
      '/search/images',
      '/search/concepts',
      '/search/events',
      '/search/stories',
    ]);
  });
});
