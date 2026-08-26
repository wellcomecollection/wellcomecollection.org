import { fireEvent, screen } from '@testing-library/react';

import {
  renderWithContext,
  RenderWithRefactoredContextOptions,
} from '@weco/content/test/fixtures/iiif/render';

import FullscreenToggleButton from './FullscreenToggleButton';

jest.mock('@weco/common/server-data/Context', () => ({
  ...jest.requireActual('@weco/common/server-data/Context'),
  useFeatureFlags: () => ({ itemViewerRefactor: true }),
}));

function renderButton(
  props: { className?: string } = {},
  options: RenderWithRefactoredContextOptions = {}
) {
  return renderWithContext(<FullscreenToggleButton {...props} />, {
    useRefactoredContext: true,
    ...options,
  });
}

describe('FullscreenToggleButton', () => {
  it('shows the "Full screen" label and maximise icon by default', () => {
    renderButton();

    expect(
      screen.getByRole('button', { name: 'Full screen' })
    ).toBeInTheDocument();
  });

  it('shows the "Exit full screen" label when isFullscreen is true', () => {
    renderButton({}, { contextProps: { isFullscreen: true } });

    expect(
      screen.getByRole('button', { name: 'Exit full screen' })
    ).toBeInTheDocument();
  });

  it('calls setIsFullscreen when clicked', () => {
    const setIsFullscreen = jest.fn();

    renderButton(
      {},
      {
        contextProps: {
          viewerRef: { current: document.createElement('div') },
          setIsFullscreen,
        },
      }
    );

    fireEvent.click(screen.getByRole('button', { name: 'Full screen' }));

    expect(setIsFullscreen).toHaveBeenCalledWith(true);
  });

  it('applies a given className to the button', () => {
    renderButton({ className: 'viewer-desktop' });

    expect(screen.getByRole('button')).toHaveClass('viewer-desktop');
  });

  describe('when fullscreen is exited by something other than this button (Escape, F11, browser UI)', () => {
    const originalFullscreenElement = document.fullscreenElement;

    afterEach(() => {
      Object.defineProperty(document, 'fullscreenElement', {
        value: originalFullscreenElement,
        configurable: true,
      });
    });

    it('syncs isFullscreen back to false via the native fullscreenchange event', () => {
      const setIsFullscreen = jest.fn();

      renderButton(
        {},
        { contextProps: { isFullscreen: true, setIsFullscreen } }
      );

      // The browser fires fullscreenchange for any exit, regardless of what
      // triggered it - here we simulate document.fullscreenElement already
      // having cleared by the time the event reaches us.
      Object.defineProperty(document, 'fullscreenElement', {
        value: null,
        configurable: true,
      });
      document.dispatchEvent(new Event('fullscreenchange'));

      expect(setIsFullscreen).toHaveBeenCalledWith(false);
    });
  });
});
