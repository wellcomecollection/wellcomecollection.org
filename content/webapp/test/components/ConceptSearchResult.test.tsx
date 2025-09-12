import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from 'styled-components';

import { Concept } from '@weco/content/services/wellcome/catalogue/types';
import theme from '@weco/common/views/themes/default';

import ConceptSearchResult from '@weco/content/views/components/ConceptSearchResult';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

const mockConcept: Concept = {
  id: 'test-concept-id',
  label: 'Test Concept',
  displayLabel: 'Test Display Label',
  type: 'Subject',
  description: {
    sourceLabel: 'nlm-mesh',
    sourceUrl: 'https://example.com',
    text: 'This is a test concept description that explains what this concept is about.',
  },
  alternativeLabels: ['Alternative Label 1', 'Alternative Label 2'],
};

const mockConceptMinimal: Concept = {
  id: 'minimal-concept-id',
  label: 'Minimal Concept',
  type: 'Agent',
};

const renderComponent = (concept: Concept, resultPosition = 0) => {
  return render(
    <ThemeProvider theme={theme}>
      <ConceptSearchResult concept={concept} resultPosition={resultPosition} />
    </ThemeProvider>
  );
};

describe('ConceptSearchResult', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/search/concepts');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the concept label and type', () => {
    renderComponent(mockConcept);
    
    expect(screen.getByText('Test Display Label')).toBeInTheDocument();
    expect(screen.getByText('Subject')).toBeInTheDocument();
    expect(screen.getByText('Type: Subject')).toBeInTheDocument();
  });

  it('renders the concept description when available', () => {
    renderComponent(mockConcept);
    
    expect(screen.getByText('This is a test concept description that explains what this concept is about.')).toBeInTheDocument();
  });

  it('renders alternative labels when available', () => {
    renderComponent(mockConcept);
    
    expect(screen.getByText('Also known as:')).toBeInTheDocument();
    expect(screen.getByText('Alternative Label 1, Alternative Label 2')).toBeInTheDocument();
  });

  it('renders concept ID when available', () => {
    renderComponent(mockConcept);
    
    expect(screen.getByText('ID: test-concept-id')).toBeInTheDocument();
  });

  it('handles minimal concept data gracefully', () => {
    renderComponent(mockConceptMinimal);
    
    expect(screen.getByText('Minimal Concept')).toBeInTheDocument();
    expect(screen.getByText('Agent')).toBeInTheDocument();
    expect(screen.getByText('Type: Agent')).toBeInTheDocument();
    expect(screen.queryByText('Also known as:')).not.toBeInTheDocument();
    expect(screen.queryByText(/This is a test concept description/)).not.toBeInTheDocument();
  });

  it('uses displayLabel when available, falls back to label', () => {
    renderComponent(mockConcept);
    expect(screen.getByText('Test Display Label')).toBeInTheDocument();
    expect(screen.queryByText('Test Concept')).not.toBeInTheDocument();

    renderComponent(mockConceptMinimal);
    expect(screen.getByText('Minimal Concept')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    renderComponent(mockConcept, 5);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('aria-label', 'View concept: Test Display Label');
    expect(link).toHaveAttribute('data-gtm-trigger', 'concepts_search_result');
    expect(link).toHaveAttribute('data-gtm-position-in-list', '6');
  });

  it('generates correct link href', () => {
    renderComponent(mockConcept);
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/concepts/test-concept-id');
  });

  it('handles concept without ID', () => {
    const conceptWithoutId: Concept = {
      label: 'No ID Concept',
      type: 'Subject',
    };
    
    renderComponent(conceptWithoutId);
    
    expect(screen.getByText('No ID Concept')).toBeInTheDocument();
    expect(screen.queryByText(/ID:/)).not.toBeInTheDocument();
  });

  it('renders heading with correct semantic level', () => {
    renderComponent(mockConcept);
    
    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent('Test Display Label');
  });
});