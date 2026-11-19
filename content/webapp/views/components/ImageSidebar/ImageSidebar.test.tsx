import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RefObject } from 'react';

import * as AppContext from '@weco/common/contexts/AppContext';
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
  source: { id: 'workA', title: 'Image A' },
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
    arrowKeysAreaRef,
  }: {
    onPrevious?: StepHandler;
    onNext?: StepHandler;
    arrowKeysAreaRef?: RefObject<HTMLElement | null>;
  } = {}
) => {
  (getWorkClientSide as jest.Mock).mockResolvedValue(work);
  const sidebar = (expandedImage?: Image, isFromUrlChange = false) => (
    <ImageSidebar
      images={expandedImage ? [expandedImage] : []}
      expandedImage={expandedImage}
      isFromUrlChange={isFromUrlChange}
      setExpandedImage={setExpandedImage}
      onStatusChange={onStatusChange}
      onPrevious={onPrevious}
      onNext={onNext}
      arrowKeysAreaRef={arrowKeysAreaRef}
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
    // As the browser's Back or Forward would
    goTo: async (next?: Image) => {
      view.rerender(sidebar(next, true));
      await act(async () => {});
    },
  };
};

describe('ImageSidebar', () => {
  it('renders no sidebar until an image is selected', async () => {
    await renderSidebar(undefined);

    expect(
      screen.queryByRole('region', { name: 'Image details' })
    ).not.toBeInTheDocument();
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

    it('keeps the image while it slides out, then removes the sidebar', async () => {
      const { select } = await renderSidebar(expandedImage);

      await select(undefined);
      expect(
        screen.getByRole('link', { name: 'View image: A title with markup' })
      ).toBeInTheDocument();

      await act(async () => {
        jest.runAllTimers();
      });
      expect(
        screen.queryByRole('region', { name: 'Image details' })
      ).not.toBeInTheDocument();
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

    /**
     * Renders the sidebar with the resize handle focused, ready for a run of
     * key presses, and returns the `userEvent` instance to press them with.
     * One instance throughout, as a standalone call blurs the handle when it
     * ends, which is itself the end of a run of presses.
     */
    const renderWithFocusedHandle = async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      await renderSidebar(expandedImage);
      // Opening moves focus to the close button on a timer. Let it, before
      // taking the handle, so it can't interrupt the presses below.
      await act(async () => {
        jest.runOnlyPendingTimers();
      });
      focusHandle();
      return user;
    };

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
      const user = await renderWithFocusedHandle();

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
      const user = await renderWithFocusedHandle();

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
      const user = await renderWithFocusedHandle();

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
    });

    describe('filling the screen', () => {
      // Below `sm` the sidebar covers the page, and the buttons move from the
      // header to a bar along the bottom
      beforeEach(() =>
        jest.spyOn(AppContext, 'useAppContext').mockReturnValue({
          ...AppContext.appContextDefaults,
          windowSize: 'zero',
        })
      );

      it('steps from the bar along the bottom', async () => {
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
      });

      it('has no bar before Phase 3', async () => {
        mockImageSidebarPhase('phase2');
        await renderSidebar(expandedImage, jest.fn(), jest.fn(), {
          onNext: jest.fn(),
        });

        expect(
          screen.queryByRole('button', { name: 'Next image' })
        ).not.toBeInTheDocument();
      });
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

    describe('announcing the image', () => {
      const status = () => screen.getByRole('status');
      const titled = (id: string, title: string) =>
        ({
          ...expandedImage,
          id,
          source: { id: `work-${id}`, title },
        }) as unknown as Image;
      // Announced after a delay, to let focus move first
      const afterAnnouncementDelay = () =>
        act(() => new Promise(resolve => setTimeout(resolve, 300)));
      const renderSteppable = () =>
        renderSidebar(expandedImage, jest.fn(), jest.fn(), {
          onNext: beforeStep => beforeStep(),
        });

      it('is on the page before the sidebar opens', async () => {
        await renderSidebar(undefined);

        expect(status()).toBeEmptyDOMElement();
      });

      it("announces the title of the image stepped to, without the image's markup", async () => {
        const { select } = await renderSteppable();

        await userEvent.click(nextButton());
        await select(titled('imageC', 'Image C <i>title</i>'));
        await afterAnnouncementDelay();

        expect(status()).toHaveTextContent(/^Image C title$/);
      });

      it("announces an image reached with the browser's Back or Forward", async () => {
        const { goTo } = await renderSteppable();

        await goTo(titled('imageB', 'Image B'));
        await afterAnnouncementDelay();

        expect(status()).toHaveTextContent('Image B');
      });

      it('announces nothing when a thumbnail is picked, as its title was just heard', async () => {
        const { select } = await renderSteppable();

        await select(titled('imageB', 'Image B'));
        await afterAnnouncementDelay();

        expect(status()).toBeEmptyDOMElement();
      });

      it('clears the last announcement when a thumbnail is picked, so a stale title is not left on the page', async () => {
        const { select } = await renderSteppable();
        await userEvent.click(nextButton());
        await select(titled('imageB', 'Image B'));
        await afterAnnouncementDelay();

        await select(titled('imageC', 'Image C'));
        await afterAnnouncementDelay();

        expect(status()).toBeEmptyDOMElement();
      });

      it('clears the announcement before the next one, so the same title is spoken again', async () => {
        const { select } = await renderSteppable();

        await userEvent.click(nextButton());
        await select(titled('imageB', 'Untitled'));
        await afterAnnouncementDelay();
        expect(status()).toHaveTextContent('Untitled');

        await userEvent.click(nextButton());
        await select(titled('imageC', 'Untitled'));
        expect(status()).toBeEmptyDOMElement();
        await afterAnnouncementDelay();
        expect(status()).toHaveTextContent('Untitled');
      });

      it('announces only the last of several quick steps', async () => {
        const { select } = await renderSteppable();
        const announced: string[] = [];
        const observer = new MutationObserver(() => {
          if (status().textContent) announced.push(status().textContent!);
        });
        observer.observe(status(), { childList: true, subtree: true });

        await userEvent.click(nextButton());
        await select(titled('imageB', 'Image B'));
        await userEvent.click(nextButton());
        await select(titled('imageC', 'Image C'));
        await afterAnnouncementDelay();
        observer.disconnect();

        expect(announced).toEqual(['Image C']);
      });
    });

    describe('with the arrow keys', () => {
      // Elements added to the page around the sidebar, removed after each test
      const added: HTMLElement[] = [];
      const addToPage = (element: HTMLElement) => {
        document.body.append(element);
        added.push(element);
      };
      afterEach(() => {
        added.splice(0).forEach(element => element.remove());
        jest.useRealTimers();
      });
      // Opening moves focus to the close button on a timer, so that's let
      // happen before focus is put anywhere else
      const afterOpening = () =>
        act(() => new Promise(resolve => setTimeout(resolve)));
      // Focus is on nothing in particular, e.g. after clicking a thumbnail
      const blur = async () => {
        await afterOpening();
        act(() => (document.activeElement as HTMLElement | null)?.blur());
      };

      it('ArrowLeft and ArrowRight step to the previous and next images', async () => {
        const onPrevious = jest.fn();
        const onNext = jest.fn();
        await renderSidebar(expandedImage, jest.fn(), jest.fn(), {
          onPrevious,
          onNext,
        });
        await blur();

        await userEvent.keyboard('{ArrowLeft}');
        await userEvent.keyboard('{ArrowRight}');

        expect(onPrevious).toHaveBeenCalledTimes(1);
        expect(onNext).toHaveBeenCalledTimes(1);
      });

      it('do not click a button with nowhere to step to', async () => {
        await renderSidebar(expandedImage, jest.fn(), jest.fn(), {
          onNext: jest.fn(),
        });
        const clicked: (string | null)[] = [];
        const recordClick = (event: MouseEvent) =>
          clicked.push(
            (event.target as HTMLElement).getAttribute('aria-label')
          );
        document.addEventListener('click', recordClick);
        await blur();

        await userEvent.keyboard('{ArrowLeft}');
        await userEvent.keyboard('{ArrowRight}');

        document.removeEventListener('click', recordClick);
        expect(clicked).toEqual(['Next image']);
      });

      it('step from the results area as well as the sidebar', async () => {
        const onNext = jest.fn();
        const area = document.createElement('div');
        const thumbnail = document.createElement('a');
        thumbnail.href = '#imageA';
        area.append(thumbnail);
        addToPage(area);
        await renderSidebar(expandedImage, jest.fn(), jest.fn(), {
          onNext,
          arrowKeysAreaRef: { current: area },
        });
        await afterOpening();
        act(() => thumbnail.focus());

        await userEvent.keyboard('{ArrowRight}');

        expect(onNext).toHaveBeenCalledTimes(1);
      });

      it("do nothing with a modifier held, as Alt+ArrowLeft is the browser's Back", async () => {
        const onPrevious = jest.fn();
        await renderSidebar(expandedImage, jest.fn(), jest.fn(), {
          onPrevious,
        });
        await blur();

        await userEvent.keyboard('{Alt>}{ArrowLeft}{/Alt}');
        await userEvent.keyboard('{Meta>}{ArrowLeft}{/Meta}');
        await userEvent.keyboard('{Control>}{ArrowLeft}{/Control}');
        await userEvent.keyboard('{Shift>}{ArrowLeft}{/Shift}');

        expect(onPrevious).not.toHaveBeenCalled();
      });

      it('step once for a held key, not on every repeat', async () => {
        const onNext = jest.fn();
        await renderSidebar(expandedImage, jest.fn(), jest.fn(), { onNext });
        await blur();

        // user-event doesn't mark held keys as repeats, so this is by hand
        fireEvent.keyDown(document.body, { key: 'ArrowRight' });
        fireEvent.keyDown(document.body, { key: 'ArrowRight', repeat: true });
        fireEvent.keyDown(document.body, { key: 'ArrowRight', repeat: true });

        expect(onNext).toHaveBeenCalledTimes(1);
      });

      it('move the cursor in a text field rather than stepping', async () => {
        const onNext = jest.fn();
        const area = document.createElement('div');
        const input = document.createElement('input');
        area.append(input);
        addToPage(area);
        await renderSidebar(expandedImage, jest.fn(), jest.fn(), {
          onNext,
          arrowKeysAreaRef: { current: area },
        });
        await afterOpening();
        act(() => input.focus());

        await userEvent.keyboard('{ArrowRight}');

        expect(onNext).not.toHaveBeenCalled();
      });

      it('resize the sidebar rather than stepping while the handle has focus', async () => {
        const onPrevious = jest.fn();
        const onNext = jest.fn();
        await renderSidebar(expandedImage, jest.fn(), jest.fn(), {
          onPrevious,
          onNext,
        });
        const handle = screen.getByRole('separator', {
          name: 'Resize image details',
        });
        await afterOpening();
        act(() => handle.focus());

        await userEvent.keyboard('{ArrowLeft}');

        expect(handle).toHaveAttribute('aria-valuenow', '7');
        expect(onPrevious).not.toHaveBeenCalled();
        expect(onNext).not.toHaveBeenCalled();
      });

      it('do nothing before Phase 3', async () => {
        mockImageSidebarPhase('phase2');
        const onNext = jest.fn();
        await renderSidebar(expandedImage, jest.fn(), jest.fn(), { onNext });
        await blur();

        await userEvent.keyboard('{ArrowRight}');

        expect(onNext).not.toHaveBeenCalled();
      });

      // Focus is moved after a timer, so these run the timers themselves
      const renderWithTimers = async (
        options: Parameters<typeof renderSidebar>[3]
      ) => {
        jest.useFakeTimers();
        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });
        const runTimers = () =>
          act(async () => {
            jest.runAllTimers();
          });
        const view = await renderSidebar(
          expandedImage,
          jest.fn(),
          jest.fn(),
          options
        );
        await runTimers();
        return { ...view, user, runTimers };
      };
      const anotherWork = {
        ...expandedImage,
        id: 'imageB',
        source: { id: 'workB', title: 'Image B' },
      } as unknown as Image;

      it('leave focus where it was, rather than moving it to the close button', async () => {
        const { user, select, runTimers } = await renderWithTimers({
          onNext: beforeStep => beforeStep(),
        });
        act(() => previousButton().focus());

        await user.keyboard('{ArrowRight}');
        await select({ ...expandedImage, id: 'imageB' });
        await runTimers();

        expect(previousButton()).toHaveFocus();
      });

      it('move focus to the button for that direction if what had it is gone, e.g. the details while another work loads', async () => {
        const { user, select, runTimers } = await renderWithTimers({
          onNext: beforeStep => beforeStep(),
        });
        const viewImageLink = screen.getByRole('link', {
          name: 'View expanded image',
        });
        act(() => viewImageLink.focus());

        await user.keyboard('{ArrowRight}');
        await select(anotherWork);
        await runTimers();

        expect(viewImageLink).not.toBeInTheDocument();
        expect(nextButton()).toHaveFocus();
      });

      it('leave focus alone if it was moved before the step landed, e.g. while the next page loaded', async () => {
        let finishStep = () => {};
        const { user, select, runTimers } = await renderWithTimers({
          onNext: beforeStep => {
            finishStep = beforeStep;
          },
        });
        const searchBox = document.createElement('input');
        addToPage(searchBox);
        act(() => nextButton().focus());

        await user.keyboard('{ArrowRight}');
        act(() => searchBox.focus());
        finishStep();
        await select(anotherWork);
        await runTimers();

        expect(searchBox).toHaveFocus();
      });

      it('announce the title of the image stepped to', async () => {
        const { select } = await renderSidebar(
          expandedImage,
          jest.fn(),
          jest.fn(),
          { onNext: beforeStep => beforeStep() }
        );
        await blur();

        await userEvent.keyboard('{ArrowRight}');
        await select({
          ...expandedImage,
          id: 'imageC',
          source: { id: 'workC', title: 'Image C' },
        } as unknown as Image);

        await waitFor(() =>
          expect(screen.getByRole('status')).toHaveTextContent('Image C')
        );
      });
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

    describe("between images, with the browser's Back and Forward", () => {
      beforeEach(() => mockImageSidebarPhase('phase3'));
      afterEach(() => jest.restoreAllMocks());
      const nextButton = () =>
        screen.getByRole('button', { name: 'Next image' });
      const imageB = { ...expandedImage, id: 'imageB' } as Image;

      it('leaves focus where it was, as stepping does', async () => {
        const { goTo } = await renderSidebar(expandedImage);
        await runTimers();
        act(() => nextButton().focus());

        await goTo(imageB);
        await runTimers();

        expect(nextButton()).toHaveFocus();
      });

      it('moves focus to the close button if it was lost', async () => {
        const { goTo } = await renderSidebar(expandedImage);
        await runTimers();
        act(() => (document.activeElement as HTMLElement).blur());

        await goTo(imageB);
        await runTimers();

        expect(closeButton()).toHaveFocus();
      });
    });

    it("moves focus to the close button when the browser's Back reopens an image whose step was cancelled by closing", async () => {
      mockImageSidebarPhase('phase3');
      // The step starts but its image never arrives, as when it's cancelled
      const { select } = await renderSidebar(
        expandedImage,
        jest.fn(),
        jest.fn(),
        { onNext: beforeStep => beforeStep() }
      );
      await runTimers();
      fireEvent.click(screen.getByRole('button', { name: 'Next image' }));

      await select(undefined);
      await runTimers();
      await select({ ...expandedImage, id: 'imageB' } as Image);
      await runTimers();

      expect(closeButton()).toHaveFocus();
      jest.restoreAllMocks();
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
