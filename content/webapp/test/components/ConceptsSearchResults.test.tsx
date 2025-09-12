import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from 'styled-components';

import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import theme from '@weco/common/views/themes/default';

import ConceptsSearchResults from '@weco/content/views/components/ConceptsSearchResults';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

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
  {
    id: 'concept-3',
    label: 'Third Concept',
    displayLabel: 'Third Display Label',
    type: 'Genre',
    alternativeLabels: ['Alt Label 2', 'Alt Label 3'],
  },
];

const renderComponent = (concepts: Concept[] = mockConcepts) => {
  return render(
    <ThemeProvider theme={theme}>
      <ConceptsSearchResults concepts={concepts} />
    </ThemeProvider>
  );
};

describe('ConceptsSearchResults', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/search/concepts');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all concepts in the list', () => {
    renderComponent();
    
    expect(screen.getByText('First Display Label')).toBeInTheDocument();
    expect(screen.getByText('Second Concept')).toBeInTheDocument();
    expect(screen.getByText('Third Display Label')).toBeInTheDocument();
  });

  it('renders concepts as list items with correct test ids', () => {
    renderComponent();
    
    const listItems = screen.getAllByTestId('concept-search-result');
    expect(listItems).toHaveLength(3);
  });

  it('passes correct result position to each concept', () => {
    renderComponent();
    
    // Check that GTM position attributes are set correctly (1-indexed)
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('data-gtm-position-in-list', '1');
    expect(links[1]).toHaveAttribute('data-gtm-position-in-list', '2');
    expect(links[2]).toHaveAttribute('data-gtm-position-in-list', '3');
  });

  it('renders empty list when no concepts provided', () => {
    renderComponent([]);
    
    const container = screen.getByTestId('concepts-search-results');
    expect(container).toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it('has correct component data attribute', () => {
    renderComponent();
    
    const container = screen.getByTestId('concepts-search-results');
    expect(container).toHaveAttribute('data-component', 'concepts-search-results');
  });

  it('renders as an unordered list', () => {
    renderComponent();
    
    const container = screen.getByTestId('concepts-search-results');
    expect(container).toBeInTheDocument();
    expect(container.tagName).toBe('UL');
  });

  it('renders list items with proper structure', () => {
    renderComponent();
    
    const listItems = screen.getAllByTestId('concept-search-result');
    expect(listItems).toHaveLength(3);
    
    // Each list item should contain a link
    listItems.forEach(item => {
      expect(item.querySelector('a')).toBeInTheDocument();
    });
  });

  it('handles single concept correctly', () => {
    const singleConcept = [mockConcepts[0]];
    renderComponent(singleConcept);
    
    expect(screen.getByText('First Display Label')).toBeInTheDocument();
    expect(screen.getAllByTestId('concept-search-result')).toHaveLength(1);
  });

  it('maintains consistent spacing with styled components', () => {
    renderComponent();
    
    const container = screen.getByTestId('concepts-search-results');
    expect(container).toHaveStyle('display: flex');
    expect(container).toHaveStyle('flex-wrap: wrap');
  });

  it('applies correct styling to list items', () => {
    renderComponent();
    
    const listItems = screen.getAllByTestId('concept-search-result');
    
    listItems.forEach(item => {
      expect(item).toHaveStyle('flex-basis: 100%');
      expect(item).toHaveStyle('max-width: 100%');
    });
  });
});