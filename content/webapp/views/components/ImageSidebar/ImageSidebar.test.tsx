import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as Context from '@weco/common/server-data/Context';
import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { Image, Work } from '@weco/content/services/wellcome/catalogue/types';
import { getWorkClientSide } from '@weco/content/services/wellcome/catalogue/works';
import { PhaseValue } from '@weco/toggles';

import ImageSidebar from '.';
import { TRANSITION_MS } from './ImageSidebar.styles';

jest.mock('@weco/content/services/wellcome/catalogue/works', () => ({
  getWorkClientSide: jest.fn(),
}));
// The visually similar images fetch their own data and have their own tests
jest.mock('@weco/content/views/components/VisuallySimilarImages', () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock('@weco/content/views/components/IIIFImage', () => ({
  __esModule: true,
  default: () => null,
}));

const expandedImage = {
  id: 'imageA',
  source: { id: 'workA' },
  locations: [{ url: 'https://iiif.example/imageA/info.json' }],
} as unknown as Image;

const work = {
  type: 'Work',
  title: 'A title with <i>markup</i>',
  items: [],
  production: [],
} as unknown as Work;

const mockImageSidebarPhase = (current: PhaseValue) =>
  jest.spyOn(Context, 'usePhasedFlags').mockImplementation(
    () =>
      ({
        imageSidebarPhases: {
          current,
          phases: [
            { id: 'phase1', label: 'Phase 1', description: '' },
            { id: 'phase2', label: 'Phase 2', description: '' },
          ],
        },
      }) as unknown as ReturnType<typeof Context.usePhasedFlags>
  );

const renderSidebar = async (
  image?: Image,
  setExpandedImage = jest.fn(),
  onStatusChange = jest.fn()
) => {
  (getWorkClientSide as jest.Mock).mockResolvedValue(work);
  const sidebar = (expandedImage?: Image) => (
    <ImageSidebar
      images={expandedImage ? [expandedImage] : []}
      expandedImage={expandedImage}
      setExpandedImage={setExpandedImage}
      onStatusChange={onStatusChange}
    />
  );
  const view = renderWithTheme(sidebar(image));
  await act(async () => {});
  return {
    ...view,
    setExpandedImage,
    select: async (next?: Image) => {
      view.rerender(sidebar(next));
      await act(async () => {});
    },
  };
};

describe('ImageSidebar', () => {
  it('renders nothing until an image is selected', async () => {
    const { container } = await renderSidebar(undefined);

    expect(container).toBeEmptyDOMElement();
  });

  it('is a region labelled "Image details"', async () => {
    await renderSidebar(expandedImage);

    expect(
      screen.getByRole('region', { name: 'Image details' })
    ).toBeInTheDocument();
  });

  it('gives the thumbnail link an accessible name from the title, without display markup', async () => {
    await renderSidebar(expandedImage);

    expect(
      screen.getByRole('link', { name: 'View image: A title with markup' })
    ).toBeInTheDocument();
  });

  it('the close button clears the selected image', async () => {
    const { setExpandedImage } = await renderSidebar(expandedImage);
    const closeButton = screen.getByRole('button', {
      name: 'Close image details',
    });

    expect(closeButton).toHaveAttribute(
      'data-gtm-trigger',
      'close-modal-button'
    );

    await userEvent.click(closeButton);

    expect(setExpandedImage).toHaveBeenCalledWith(undefined);
  });

  describe('sliding in and out', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());
    afterEach(() => window.history.replaceState(null, '', '/'));
    const sidebar = () => screen.getByRole('region', { name: 'Image details' });

    it('says when it starts and finishes opening and closing', async () => {
      const onStatusChange = jest.fn();
      const { select } = await renderSidebar(
        undefined,
        jest.fn(),
        onStatusChange
      );

      const finishSlide = () =>
        act(async () => {
          jest.runAllTimers();
        });

      await select(expandedImage);
      await finishSlide();
      await select(undefined);
      await finishSlide();

      expect(onStatusChange.mock.calls.map(([status]) => status)).toEqual([
        'opening',
        'open',
        'closing',
        'closed',
      ]);
    });

    it('keeps the image while it slides out, then renders nothing', async () => {
      const { container, select } = await renderSidebar(expandedImage);

      await select(undefined);
      expect(
        screen.getByRole('link', { name: 'View image: A title with markup' })
      ).toBeInTheDocument();

      await act(async () => {
        jest.runAllTimers();
      });
      expect(container).toBeEmptyDOMElement();
    });

    it('slides in an image chosen after the page loads, but not one that was in the URL', async () => {
      const chosen = await renderSidebar(undefined);
      await chosen.select(expandedImage);
      expect(getComputedStyle(sidebar()).transition).toBe(
        `transform ${TRANSITION_MS}ms ease-in-out`
      );
      chosen.unmount();

      window.history.replaceState(null, '', `/#${expandedImage.id}`);
      const linked = await renderSidebar(undefined);
      await linked.select(expandedImage);
      await act(async () => {
        jest.runAllTimers();
      });
      expect(getComputedStyle(sidebar()).transition).toBe('none');
    });
  });

  describe('resizing', () => {
    beforeEach(() => mockImageSidebarPhase('phase2'));
    beforeEach(() => {
      window.dataLayer = [];
    });
    afterEach(() => jest.restoreAllMocks());
    afterEach(() => jest.useRealTimers());
    const handle = () =>
      screen.getByRole('separator', { name: 'Resize image details' });
    const focusHandle = () => act(() => handle().focus());
    const sidebarColumns = () =>
      screen
        .getByRole('region', { name: 'Image details' })
        .style.getPropertyValue('--sidebar-columns');
    const resizeEvents = () =>
      (window.dataLayer ?? []).filter(
        event => event.event === 'sidebar_resize'
      );

    it('has no handle before Phase 2', async () => {
      mockImageSidebarPhase('phase1');
      await renderSidebar(expandedImage);

      expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    });

    it('starts at 6 of the 12 columns', async () => {
      await renderSidebar(expandedImage);

      expect(handle()).toHaveAttribute('aria-valuetext', '6 of 12 columns');
      expect(sidebarColumns()).toBe('6');
    });

    it('the arrow keys move it a column at a time, from 3 to 9 columns', async () => {
      await renderSidebar(expandedImage);
      focusHandle();

      await userEvent.keyboard('{ArrowLeft}');
      expect(handle()).toHaveAttribute('aria-valuenow', '7');
      expect(sidebarColumns()).toBe('7');

      await userEvent.keyboard('{ArrowRight}{ArrowRight}');
      expect(handle()).toHaveAttribute('aria-valuenow', '5');

      await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
      expect(handle()).toHaveAttribute('aria-valuenow', '3');

      await userEvent.keyboard('{End}{ArrowLeft}');
      expect(handle()).toHaveAttribute('aria-valuenow', '9');

      await userEvent.keyboard('{Home}');
      expect(handle()).toHaveAttribute('aria-valuenow', '3');
    });

    it('keeps its width when another image is chosen, and goes back to the default once closed', async () => {
      jest.useFakeTimers();
      const { select } = await renderSidebar(expandedImage);
      focusHandle();
      await userEvent.keyboard('{ArrowLeft}', { delay: null });

      await select({ ...expandedImage, id: 'imageB' });
      expect(sidebarColumns()).toBe('7');

      await select(undefined);
      await act(async () => {
        jest.runAllTimers();
      });
      await select(expandedImage);
      expect(sidebarColumns()).toBe('6');
    });

    it('records a resize once the keys stop, not on every press', async () => {
      jest.useFakeTimers();
      // One instance throughout, as a standalone call blurs the handle when it
      // ends, which is itself the end of a run of presses
      const user = userEvent.setup({ delay: null });
      await renderSidebar(expandedImage);
      // Opening moves focus to the close button on a timer. Let it, before
      // taking the handle, so it can't interrupt the presses below.
      await act(async () => {
        jest.runOnlyPendingTimers();
      });
      focusHandle();

      await user.keyboard('{ArrowLeft}{ArrowLeft}');
      expect(resizeEvents()).toHaveLength(0);

      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      expect(resizeEvents()).toEqual([
        { event: 'sidebar_resize', resize_direction: 'increase', width: 8 },
      ]);
    });

    it('records a held key once, when it is let go', async () => {
      jest.useFakeTimers();
      // One instance throughout, as a standalone call blurs the handle when it
      // ends, which is itself the end of a run of presses
      const user = userEvent.setup({ delay: null });
      await renderSidebar(expandedImage);
      // Opening moves focus to the close button on a timer. Let it, before
      // taking the handle, so it can't interrupt the presses below.
      await act(async () => {
        jest.runOnlyPendingTimers();
      });
      focusHandle();

      // Held down, so it repeats without coming up in between
      await user.keyboard('{ArrowLeft>3}');
      await act(async () => {
        jest.advanceTimersByTime(1000);
      });
      expect(resizeEvents()).toHaveLength(0);

      await user.keyboard('{/ArrowLeft}');
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      expect(resizeEvents()).toEqual([
        { event: 'sidebar_resize', resize_direction: 'increase', width: 9 },
      ]);
    });

    it('records each run of presses against the width it started from', async () => {
      jest.useFakeTimers();
      // One instance throughout, as a standalone call blurs the handle when it
      // ends, which is itself the end of a run of presses
      const user = userEvent.setup({ delay: null });
      await renderSidebar(expandedImage);
      // Opening moves focus to the close button on a timer. Let it, before
      // taking the handle, so it can't interrupt the presses below.
      await act(async () => {
        jest.runOnlyPendingTimers();
      });
      focusHandle();

      await user.keyboard('{ArrowLeft}');
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      await user.keyboard('{ArrowRight}{ArrowRight}');
      await act(async () => {
        jest.advanceTimersByTime(500);
      });

      expect(resizeEvents()).toEqual([
        { event: 'sidebar_resize', resize_direction: 'increase', width: 7 },
        { event: 'sidebar_resize', resize_direction: 'decrease', width: 5 },
      ]);
    });
  });

  describe('focus', () => {
    // Focus is moved after a timer (see the sidebar), so the timers are ours to run
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());
    // The fake thumbnail below is on the page, not in what's rendered
    afterEach(() => document.getElementById(expandedImage.id)?.remove());
    const runTimers = () =>
      act(() => {
        jest.runAllTimers();
      });
    const closeButton = () =>
      screen.getByRole('button', { name: 'Close image details' });

    it('moves to the close button when it opens', async () => {
      const { select } = await renderSidebar(undefined);

      await select(expandedImage);
      await runTimers();

      expect(closeButton()).toHaveFocus();
    });

    // Some browsers focus the thumbnail the URL hash points at a moment after
    // the sidebar has moved focus, and the sidebar takes it back. That can't be
    // seen in the browsers the e2e tests run in, so it's imitated here by
    // focusing the thumbnail ourselves.
    it('takes focus back if the browser then focuses the thumbnail', async () => {
      const thumbnail = document.createElement('a');
      thumbnail.id = expandedImage.id;
      thumbnail.href = '#';
      document.body.appendChild(thumbnail);
      const { select } = await renderSidebar(undefined);

      await select(expandedImage);
      // Only the timer that focuses the close button, not the one that stops
      // watching for the thumbnail being focused
      act(() => {
        jest.advanceTimersToNextTimer();
      });
      expect(closeButton()).toHaveFocus();

      act(() => thumbnail.focus());

      expect(closeButton()).toHaveFocus();
    });
  });
});
