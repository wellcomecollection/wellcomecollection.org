import Modal from '@weco/common/views/components/Modal/Modal';
import { useState, useRef } from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import theme from '@weco/common/views/themes/default';
import userEvent from '@testing-library/user-event';

const renderComponent = () => {
  const ModalExample = () => {
    const [isActive, setIsActive] = useState(false);
    const openButtonRef = useRef(null);

    return (
      <ThemeProvider theme={theme}>
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

  it('should focus the close button when opened', () => {
    renderComponent();
    const openButton = screen.getByText(/^Open modal window$/i);
    const closeButton = screen.getByTestId('close-modal-button');
    userEvent.click(openButton);
    expect(document.activeElement).toEqual(closeButton);
  });

  it('should focus the open button when closed', () => {
    renderComponent();
    const openButton = screen.getByText(/^Open modal window$/i);
    const closeButton = screen.getByTestId('close-modal-button');
    userEvent.click(openButton);
    userEvent.click(closeButton);
    expect(document.activeElement).toEqual(openButton);
  });
});
