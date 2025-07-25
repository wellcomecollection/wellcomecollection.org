import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { ThemeProvider } from 'styled-components';

import { AppContextProvider } from '@weco/common/contexts/AppContext';
import Modal from '@weco/common/views/components/Modal';
import theme from '@weco/common/views/themes/default';

const renderComponent = () => {
  const ModalExample = () => {
    const [isActive, setIsActive] = useState(false);
    const openButtonRef = useRef(null);

    return (
      <ThemeProvider theme={theme}>
        <AppContextProvider>
          <div>
            <button ref={openButtonRef} onClick={() => setIsActive(true)}>
              Open modal window
            </button>
            <Modal
              id="modal-example"
              isActive={isActive}
              setIsActive={setIsActive}
              openButtonRef={openButtonRef}
            >
              <p>This is a modal window.</p>
            </Modal>
          </div>
        </AppContextProvider>
      </ThemeProvider>
    );
  };
  render(<ModalExample />);
};

describe('Modal', () => {
  it('should have an unfocused button on initial render', () => {
    renderComponent();
    const openButton = screen.getByText(/^Open modal window$/i);
    expect(document.activeElement).not.toEqual(openButton);
  });

  it('should focus the close button when opened', async () => {
    renderComponent();
    const openButton = screen.getByText(/^Open modal window$/i);
    await userEvent.click(openButton);

    const closeButton = screen.getByTestId('close-modal-button');
    await expect(document.activeElement).toEqual(closeButton);
  });

  it('should focus the open button when closed', async () => {
    renderComponent();
    const openButton = screen.getByText(/^Open modal window$/i);
    await userEvent.click(openButton);

    const closeButton = screen.getByTestId('close-modal-button');
    await userEvent.click(closeButton);

    await expect(document.activeElement).toEqual(openButton);
  });
});
