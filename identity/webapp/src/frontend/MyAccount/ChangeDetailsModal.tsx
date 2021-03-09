import React, { useRef, useState } from 'react';
import Modal from '@weco/common/views/components/Modal/Modal';
import { Button } from './MyAccount.style';

type ChangeDetailsModalProps = {
  id: string;
  buttonText: string;
  content: React.ComponentType;
  isDangerous?: boolean;
};

export const ChangeDetailsModal: React.FC<ChangeDetailsModalProps> = ({
  id,
  buttonText,
  content: Content,
  isDangerous = false,
}) => {
  const [isActive, setIsActive] = useState(false);
  const openButton = useRef(null);

  return (
    <>
      <Button isDangerous={isDangerous} onClick={() => setIsActive(true)} ref={openButton}>
        {buttonText}
      </Button>
      <Modal id={id} isActive={isActive} setIsActive={setIsActive} openButtonRef={openButton}>
        <Content />
      </Modal>
    </>
  );
};
