import React, { useRef, useState } from 'react';
import Modal from '@weco/common/views/components/Modal/Modal';

type ChangeDetailsModalProps = {
  id: string;
  buttonText: string;
  content: React.ComponentType;
};

export const ChangeDetailsModal: React.FC<ChangeDetailsModalProps> = ({ id, buttonText, content: Content }) => {
  const [isActive, setIsActive] = useState(false);
  const openButton = useRef(null);

  return (
    <>
      <button onClick={() => setIsActive(true)} ref={openButton}>
        {buttonText}
      </button>
      <Modal id={id} isActive={isActive} setIsActive={setIsActive} openButtonRef={openButton}>
        <Content />
      </Modal>
    </>
  );
};
