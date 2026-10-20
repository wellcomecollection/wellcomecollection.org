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

const renderSidebar = async (image?: Image, setExpandedImage = jest.fn()) => {
  (getWorkClientSide as jest.Mock).mockResolvedValue(work);
  const sidebar = (expandedImage?: Image) => (
    <ImageSidebar
      images={expandedImage ? [expandedImage] : []}
      expandedImage={expandedImage}
      setExpandedImage={setExpandedImage}
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

  describe('focus', () => {
    // Focus is moved after a timer (see the sidebar), so the timers are ours to run
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());
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

    it("doesn't take focus back when another image is selected while it's open", async () => {
      const { select } = await renderSidebar(undefined);
      await select(expandedImage);
      await runTimers();

      const elsewhere = document.createElement('button');
      document.body.appendChild(elsewhere);
      elsewhere.focus();
      await select({ ...expandedImage, id: 'imageB' } as Image);
      await runTimers();

      expect(elsewhere).toHaveFocus();
      elsewhere.remove();
    });
  });
});
