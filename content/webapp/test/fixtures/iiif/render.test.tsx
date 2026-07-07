import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { useUserContext } from '@weco/common/contexts/UserContext';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';

import { renderWithContext } from './render';
import { createMockCanvas } from './transformed-manifest';

const Probe = () => {
  const { transformedManifest } = useItemViewerContext();
  const { isFullSupportBrowser } = useAppContext();
  const { userIsStaffWithRestricted } = useUserContext();
  return (
    <div>
      <span data-testid="canvas-count">
        {transformedManifest ? transformedManifest.canvases.length : 'none'}
      </span>
      <span data-testid="full-support">{String(isFullSupportBrowser)}</span>
      <span data-testid="staff">{String(userIsStaffWithRestricted)}</span>
    </div>
  );
};

describe('renderWithContext harness', () => {
  it('provides a default single-canvas manifest and default app/user context', () => {
    renderWithContext(<Probe />);
    expect(screen.getByTestId('canvas-count')).toHaveTextContent('1');
    expect(screen.getByTestId('full-support')).toHaveTextContent('false');
    expect(screen.getByTestId('staff')).toHaveTextContent('false');
  });

  it('applies context, app and user overrides', () => {
    renderWithContext(<Probe />, {
      contextProps: {
        transformedManifest: undefined,
      },
      appContext: { isFullSupportBrowser: true },
      userContext: { userIsStaffWithRestricted: true },
    });
    expect(screen.getByTestId('canvas-count')).toHaveTextContent('none');
    expect(screen.getByTestId('full-support')).toHaveTextContent('true');
    expect(screen.getByTestId('staff')).toHaveTextContent('true');
  });

  it('builds canvases via the canvas factory', () => {
    const { contextValue } = renderWithContext(<Probe />, {
      contextProps: {
        transformedManifest: undefined,
      },
    });
    expect(contextValue.transformedManifest).toBeUndefined();
    expect(createMockCanvas({ label: '2' }).label).toBe('2');
  });
});
