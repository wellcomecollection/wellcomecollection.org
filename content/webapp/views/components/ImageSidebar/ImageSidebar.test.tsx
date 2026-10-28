import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';
import { Image, Work } from '@weco/content/services/wellcome/catalogue/types';
import { getWorkClientSide } from '@weco/content/services/wellcome/catalogue/works';

import ImageSidebar from '.';

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

    await userEvent.click(
      screen.getByRole('button', { name: 'Close image details' })
    );

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

    it('says it is open if it already is when it mounts', async () => {
      const onStatusChange = jest.fn();
      await renderSidebar(expandedImage, jest.fn(), onStatusChange);

      expect(onStatusChange.mock.calls).toEqual([['open']]);
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

    it('slides in an image that is chosen', async () => {
      const { select } = await renderSidebar(undefined);

      await select(expandedImage);

      expect(getComputedStyle(sidebar()).transition).toBe(
        'transform 300ms ease-in-out'
      );
    });

    it('just appears for an image that was in the URL when the page loaded', async () => {
      window.history.replaceState(null, '', `/#${expandedImage.id}`);
      const { select } = await renderSidebar(undefined);

      await select(expandedImage);
      await act(async () => {
        jest.runAllTimers();
      });

      expect(getComputedStyle(sidebar()).transition).toBe('none');
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
