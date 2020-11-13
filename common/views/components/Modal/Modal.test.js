import Modal from '@weco/common/views/components/Modal/Modal';
import { useState, useRef } from 'react';
import { mountWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';

const openModalButtonSelector = '[data-test-id="open-modal-button"]';
const closeModalButtonSelector = '[role="button"]';

const ModalExample = () => {
  const [isActive, setIsActive] = useState(false);
  const openButtonRef = useRef(null);

  return (
    <div>
      <button
        ref={openButtonRef}
        data-test-id="open-modal-button"
        onClick={() => setIsActive(true)}
      >
        open
      </button>
      <Modal
        isActive={isActive}
        setIsActive={setIsActive}
        openButtonRef={openButtonRef}
      >
        <p>This is a modal window.</p>
      </Modal>
    </div>
  );
};

describe('Modal', () => {
  it(`should have an unfocused button on initial render`, () => {
    const component = mountWithTheme(<ModalExample />);
    const openButton = component.find(openModalButtonSelector);

    expect(openButton.is(':focus')).toBe(false);
  });

  it(`should focus the close button when opened`, () => {
    const component = mountWithTheme(<ModalExample />);
    const openButton = component.find(openModalButtonSelector);
    const closeButton = component.find(closeModalButtonSelector);

    openButton.simulate('click');

    expect(closeButton.is(':focus')).toBe(true);
  });

  it(`should focus the open button when closed`, () => {
    const component = mountWithTheme(<ModalExample />);
    const openButton = component.find(openModalButtonSelector);
    const closeButton = component.find(closeModalButtonSelector);

    openButton.simulate('click');
    closeButton.simulate('click');

    expect(openButton.is(':focus')).toBe(true);
  });
});
