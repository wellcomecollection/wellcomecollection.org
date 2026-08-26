import { screen } from '@testing-library/react';

import { ItemViewerContextProps } from '@weco/content/contexts/ItemViewerContext/refactored';
import { renderWithContext } from '@weco/content/test/fixtures/iiif/render';
import {
  createMockCanvas,
  createMockManifest,
  createMockQuery,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';

import CanvasPositionIndicator, {
  useCanvasPositionLabel,
} from './CanvasPositionIndicator';

const threeCanvases = createMockManifest({
  canvases: [createMockCanvas(), createMockCanvas(), createMockCanvas()],
});

const render = (
  ui: React.ReactElement,
  contextProps: Partial<ItemViewerContextProps> = {}
) =>
  renderWithContext(ui, {
    contextProps: { transformedManifest: threeCanvases, ...contextProps },
    useRefactoredContext: true,
  });

describe('CanvasPositionIndicator', () => {
  it('renders the 1-based canvas position and the total', () => {
    const { container } = render(<CanvasPositionIndicator />, {
      query: createMockQuery({ canvas: 2 }),
    });

    expect(container).toHaveTextContent('2/3');
  });

  it('puts positionTestId on the position alone, without the separator or total', () => {
    // Playwright asserts this element's exact text, so the position can't be
    // rolled into the same node as the rest of the label.
    render(<CanvasPositionIndicator positionTestId="active-index" />, {
      query: createMockQuery({ canvas: 2 }),
    });

    expect(screen.getByTestId('active-index')).toHaveTextContent(/^2$/);
  });

  it('renders no test id when positionTestId is omitted, so two indicators can coexist', () => {
    // The top bar and the bottom bar both render one; a shared id would match
    // twice and break getByTestId.
    const { container } = render(<CanvasPositionIndicator />);

    expect(container.querySelector('[data-testid]')).not.toBeInTheDocument();
  });

  it('shows an out-of-range canvas number as-is rather than clamping it', () => {
    const { container } = render(<CanvasPositionIndicator />, {
      query: createMockQuery({ canvas: 9999 }),
    });

    expect(container).toHaveTextContent('9999/3');
  });
});

describe('useCanvasPositionLabel', () => {
  const ShowLabel = () => <>{useCanvasPositionLabel()}</>;

  it('returns the same label the indicator renders', () => {
    const { container } = render(<ShowLabel />, {
      query: createMockQuery({ canvas: 2 }),
    });

    expect(container).toHaveTextContent('2/3');
  });
});
