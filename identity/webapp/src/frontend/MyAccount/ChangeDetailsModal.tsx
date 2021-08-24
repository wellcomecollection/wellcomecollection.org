import React, { useRef, useState } from 'react';
import Modal from '@weco/common/views/components/Modal/Modal';
import { Button } from './MyAccount.style';
import { UpdateUserSchema } from '../../types/schemas/update-user';

export type ChangeDetailsModalContentProps =
  | Record<string, never>
  | {
      onCancel: () => void;
      onComplete: () => void;
      isActive: boolean;
    };

type ChangeDetailsModalProps = {
  id: string;
  buttonText: string;
  isDangerous?: boolean;
  onComplete: (newDetails?: UpdateUserSchema) => void;
};

export const ChangeDetailsModal: React.FC<ChangeDetailsModalProps> = ({
  id,
  buttonText,
  isDangerous = false,
  onComplete,
  children,
}) => {
  const [isActive, setIsActive] = useState(false);
  const openButton = useRef(null);

  const handleComplete = (newDetails?: UpdateUserSchema) => {
    onComplete(newDetails);
    setIsActive(false);
  };

  const close = () => setIsActive(false);

  return (
    <>
      <Button isDangerous={isDangerous} onClick={() => setIsActive(true)} ref={openButton}>
        {buttonText}
      </Button>
      <Modal id={id} isActive={isActive} setIsActive={setIsActive} openButtonRef={openButton}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            const props: ChangeDetailsModalContentProps = { onComplete: handleComplete, onCancel: close, isActive };
            return React.cloneElement(child, props);
          }
        })}
      </Modal>
    </>
  );
};
