import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { ThemeProvider } from 'styled-components';

import { captionedImage } from '@weco/cardigan/stories/data/images';
import { AppContextProvider } from '@weco/common/views/components/AppContext/AppContext';
import theme from '@weco/common/views/themes/default';

import ImageGallery from './';

window.HTMLElement.prototype.scrollIntoView = jest.fn(); // scrollIntoView is not in JSDOM: https://stackoverflow.com/a/60225417

const images = [...new Array(3)].map(() => captionedImage());

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
    const openButton = screen.getByTestId('open-image-gallery-button');
    expect(document.activeElement).not.toEqual(openButton);
  });

  it('should focus the close button when opened', async () => {
    renderComponent();
    const openButton = screen.getByTestId('open-image-gallery-button');
    await act(async () => {
      await userEvent.click(openButton);
    });
    const closeButton = screen.getByTestId('close-image-gallery-button');
    expect(document.activeElement).toEqual(closeButton);
  });

  it('should focus the open button when closed', async () => {
    renderComponent();
    const openButton = screen.getByTestId('open-image-gallery-button');
    await act(async () => {
      await userEvent.click(openButton);
    });
    const closeButton = screen.getByTestId('close-image-gallery-button');
    await act(async () => {
      await userEvent.click(closeButton);
    });
    expect(document.activeElement).toEqual(openButton);
  });
});
