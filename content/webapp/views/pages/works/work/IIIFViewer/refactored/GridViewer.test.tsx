import { screen } from '@testing-library/react';

import { ItemViewerContextProps } from '@weco/content/contexts/ItemViewerContext/refactored';
import { renderWithContext } from '@weco/content/test/fixtures/iiif/render';
import {
  createMockCanvas,
  createMockManifest,
  createMockQuery,
} from '@weco/content/test/fixtures/iiif/transformed-manifest';

import GridViewer from './GridViewer';

// The refactored components read from ItemViewerContextRefactored via the
// useItemViewerContext hook, which checks the feature flag. Mock it so the
// hook returns the refactored context values.
jest.mock('@weco/common/server-data/Context', () => ({
  ...jest.requireActual('@weco/common/server-data/Context'),
  useFeatureFlags: () => ({ itemViewerRefactor: true }),
}));

const renderGrid = (contextProps: Partial<ItemViewerContextProps> = {}) =>
  renderWithContext(<GridViewer />, {
    contextProps,
    useRefactoredContext: true,
  });

describe('GridViewer', () => {
  it('marks only the cell for the current canvas as aria-current', () => {
    renderGrid({
      transformedManifest: createMockManifest({
        canvases: [
          createMockCanvas({ id: 'a' }),
          createMockCanvas({ id: 'b' }),
          createMockCanvas({ id: 'c' }),
        ],
      }),
      query: createMockQuery({ canvas: 2 }),
    });

    const links = screen.getAllByRole('link');
    const current = links.filter(
      link => link.getAttribute('aria-current') === 'true'
    );

    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAttribute(
      'href',
      expect.stringContaining('canvas=2')
    );
  });
});
