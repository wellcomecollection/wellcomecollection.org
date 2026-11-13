import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as Context from '@weco/common/server-data/Context';
import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { Image, Work } from '@weco/content/services/wellcome/catalogue/types';
import { getWorkClientSide } from '@weco/content/services/wellcome/catalogue/works';
import { PhaseValue } from '@weco/toggles';

import ImageSidebar, { StepHandler } from '.';
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
            { id: 'phase3', label: 'Phase 3', description: '' },
          ],
        },
      }) as unknown as ReturnType<typeof Context.usePhasedFlags>
  );

const renderSidebar = async (
  image?: Image,
  setExpandedImage = jest.fn(),
  onStatusChange = jest.fn(),
  {
    onPrevious,
    onNext,
  }: { onPrevious?: StepHandler; onNext?: StepHandler } = {}
) => {
  (getWorkClientSide as jest.Mock).mockResolvedValue(work);
  const sidebar = (expandedImage?: Image) => (
    <ImageSidebar
      images={expandedImage ? [expandedImage] : []}
      expandedImage={expandedImage}
      setExpandedImage={setExpandedImage}
      onStatusChange={onStatusChange}
      onPrevious={onPrevious}
      onNext={onNext}
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

  it('in Phase 3, shows a label on the close button, keeping its accessible name', async () => {
    mockImageSidebarPhase('phase3');
    await renderSidebar(expandedImage);

    expect(
      screen.getByRole('button', { name: 'Close image details' })
    ).toHaveTextContent('Close image details');
    expect(screen.getByText('Close')).toBeVisible();
    jest.restoreAllMocks();
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
    afterEach(() => jest.restoreAllMocks());
    afterEach(() => jest.useRealTimers());
    const handle = () =>
      screen.getByRole('separator', { name: 'Resize image details' });
    const focusHandle = () => act(() => handle().focus());
    const sidebarColumns = () =>
      screen
        .getByRole('region', { name: 'Image details' })
        .style.getPropertyValue('--sidebar-columns');

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
  });

  describe('stepping through the results', () => {
    beforeEach(() => mockImageSidebarPhase('phase3'));
    afterEach(() => jest.restoreAllMocks());
    const previousButton = () =>
      screen.getByRole('button', { name: 'Previous image' });
    const nextButton = () => screen.getByRole('button', { name: 'Next image' });

    it('has no previous or next buttons before Phase 3', async () => {
      mockImageSidebarPhase('phase2');
      await renderSidebar(expandedImage, jest.fn(), jest.fn(), {
        onPrevious: jest.fn(),
        onNext: jest.fn(),
      });

      expect(
        screen.queryByRole('button', { name: 'Next image' })
      ).not.toBeInTheDocument();
    });

    it('steps to the previous and next images', async () => {
      const onPrevious = jest.fn();
      const onNext = jest.fn();
      await renderSidebar(expandedImage, jest.fn(), jest.fn(), {
        onPrevious,
        onNext,
      });

      await userEvent.click(previousButton());
      await userEvent.click(nextButton());

      expect(onPrevious).toHaveBeenCalledTimes(1);
      expect(onNext).toHaveBeenCalledTimes(1);
      expect(previousButton()).toHaveAttribute(
        'data-gtm-trigger',
        'image_sidebar_previous'
      );
      expect(nextButton()).toHaveAttribute(
        'data-gtm-trigger',
        'image_sidebar_next'
      );
    });

    it('disables a button with nowhere to step to, but keeps it focusable', async () => {
      const onNext = jest.fn();
      await renderSidebar(expandedImage, jest.fn(), jest.fn(), { onNext });

      expect(previousButton()).toHaveAttribute('aria-disabled', 'true');
      expect(previousButton()).not.toBeDisabled();
      expect(nextButton()).toHaveAttribute('aria-disabled', 'false');
    });

    it('leaves focus on the button used, rather than moving it to the close button', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { select } = await renderSidebar(
        expandedImage,
        jest.fn(),
        jest.fn(),
        { onNext: beforeStep => beforeStep() }
      );
      await act(async () => {
        jest.runAllTimers();
      });

      await user.click(nextButton());
      await select({ ...expandedImage, id: 'imageB' });
      await act(async () => {
        jest.runAllTimers();
      });

      expect(nextButton()).toHaveFocus();
      jest.useRealTimers();
    });

    it('moves focus to the close button as usual if a step never happened', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      // e.g. the next page of results couldn't be loaded
      const { select } = await renderSidebar(
        expandedImage,
        jest.fn(),
        jest.fn(),
        { onNext: jest.fn() }
      );
      await act(async () => {
        jest.runAllTimers();
      });

      await user.click(nextButton());
      // Then a thumbnail is chosen
      await select({ ...expandedImage, id: 'imageB' });
      await act(async () => {
        jest.runAllTimers();
      });

      expect(
        screen.getByRole('button', { name: 'Close image details' })
      ).toHaveFocus();
      jest.useRealTimers();
    });

    it('announces the title of the image stepped to, but not one chosen otherwise', async () => {
      const { select } = await renderSidebar(
        expandedImage,
        jest.fn(),
        jest.fn(),
        { onNext: beforeStep => beforeStep() }
      );
      const liveRegion = document.querySelector('[aria-live="polite"]');

      await select({ ...expandedImage, id: 'imageB' });
      expect(liveRegion).toBeEmptyDOMElement();

      await userEvent.click(nextButton());
      await select({
        ...expandedImage,
        id: 'imageC',
        source: { id: 'workC' },
      } as unknown as Image);

      expect(liveRegion).toHaveTextContent('A title with markup');
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
