import * as prismic from '@prismicio/client';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import { AppContextProvider } from '@weco/common/views/components/AppContext/AppContext';
import theme from '@weco/common/views/themes/default';

import ImageGallery from './';

window.HTMLElement.prototype.scrollIntoView = jest.fn(); // scrollIntoView is not in JSDOM: https://stackoverflow.com/a/60225417

const image = {
  contentUrl:
    'https://cardigan.wellcomecollection.org/images/reading-room-3200x1800.jpg',
  width: 3200,
  height: 1800,
  alt: 'an image with some alt text',
  tasl: {
    title: 'The title of the image',
    author: 'The author',
    sourceName: 'Wellcome Collection',
    sourceLink: 'https://wellcomecollection.org/works',
  },
};
const captionedImage = () => ({
  image,
  caption: [
    {
      type: 'paragraph',
      text: 'Etiam pellentesque dui tellus, quis dictum turpis blandit id. Etiam.',
      spans: [],
    },
  ] as prismic.RichTextField,
  hasRoundedCorners: false,
});

const images = [captionedImage()];

const renderComponent = () => {
  const ImageGalleryExample = () => {
    return (
      <ThemeProvider theme={theme}>
        <AppContextProvider>
          <ImageGallery
            id="test"
            isStandalone={false}
            isFrames={false}
            items={images}
          />
        </AppContextProvider>
      </ThemeProvider>
    );
  };
  render(<ImageGalleryExample />);
};

describe('ImageGallery', () => {
  it('should have an unfocused button on initial render', () => {
    renderComponent();
    const openButton = screen.getByRole('button', { name: '1 images' });
    return expect(openButton).not.toHaveFocus();
  });

  it('should focus the close button when opened', async () => {
    renderComponent();
    const openButton = screen.getByRole('button', { name: '1 images' });
    await act(async () => {
      await userEvent.click(openButton);
    });
    const closeButton = screen.getByTestId('close-image-gallery-button');
    return expect(closeButton).toHaveFocus();
  });

  it('should focus the open button when closed', async () => {
    renderComponent();
    const openButton = screen.getByRole('button', { name: '1 images' });
    await act(async () => {
      await userEvent.click(openButton);
    });
    const closeButton = screen.getByTestId('close-image-gallery-button');
    await act(async () => {
      await userEvent.click(closeButton);
    });
    return expect(openButton).toHaveFocus();
  });
});
