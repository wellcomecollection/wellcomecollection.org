import '@testing-library/jest-dom';

import { screen } from '@testing-library/react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { useKiosk } from '@weco/common/contexts/KioskContext';
import { useUserContext } from '@weco/common/contexts/UserContext';
import { useItemViewerContext } from '@weco/content/contexts/ItemViewerContext';

import { renderWithContext } from './render';
import { createMockCanvas } from './transformed-manifest';

const Probe = () => {
  const { transformedManifest } = useItemViewerContext();
  const { isFullSupportBrowser } = useAppContext();
  const { userIsStaffWithRestricted } = useUserContext();
  const { isKiosk } = useKiosk();

  return (
    <div>
      <span data-testid="canvas-count">
        {transformedManifest?.canvases.length}
      </span>
      <span data-testid="full-support">{String(isFullSupportBrowser)}</span>
      <span data-testid="staff">{String(userIsStaffWithRestricted)}</span>
      <span data-testid="kiosk">{String(isKiosk)}</span>
    </div>
  );
};

describe('renderWithContext harness', () => {
  it('provides a default single-canvas manifest and default app/user/kiosk context', () => {
    renderWithContext(<Probe />);
    expect(screen.getByTestId('canvas-count')).toHaveTextContent('1');
    expect(screen.getByTestId('full-support')).toHaveTextContent('false');
    expect(screen.getByTestId('staff')).toHaveTextContent('false');
    expect(screen.getByTestId('kiosk')).toHaveTextContent('false');
  });

  it('applies context, app, user and kiosk overrides', () => {
    renderWithContext(<Probe />, {
      contextProps: {
        transformedManifest: undefined,
      },
      appContext: { isFullSupportBrowser: true },
      userContext: { userIsStaffWithRestricted: true },
      kioskContext: { isKiosk: true },
    });
    expect(screen.getByTestId('canvas-count')).toBeEmptyDOMElement();
    expect(screen.getByTestId('full-support')).toHaveTextContent('true');
    expect(screen.getByTestId('staff')).toHaveTextContent('true');
    expect(screen.getByTestId('kiosk')).toHaveTextContent('true');
  });

  it('exposes contextValue and provides canvas factory helper', () => {
    const { contextValue } = renderWithContext(<Probe />, {
      contextProps: {
        transformedManifest: undefined,
      },
    });
    expect(contextValue.transformedManifest).toBeUndefined();
    expect(createMockCanvas({ label: '2' }).label).toBe('2');
  });
});
