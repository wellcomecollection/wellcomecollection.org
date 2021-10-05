import React, { ReactElement, useRef, useState } from 'react';
import Modal from '@weco/common/views/components/Modal/Modal';
import ButtonOutlined from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
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
  render: (props: ChangeDetailsModalContentProps) => ReactElement;
};

export const ChangeDetailsModal: React.FC<ChangeDetailsModalProps> = ({
  id,
  buttonText,
  isDangerous = false,
  onComplete,
  render,
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
      <ButtonOutlined
        text={buttonText}
        isDangerous={isDangerous}
        clickHandler={() => setIsActive(true)}
        ref={openButton}
      />
      <Modal
        id={id}
        isActive={isActive}
        setIsActive={setIsActive}
        openButtonRef={openButton}
      >
        {render({
          onComplete: handleComplete,
          onCancel: close,
          isActive,
        })}
      </Modal>
    </>
  );
};
