import { FunctionComponent, ReactElement, useRef, useState } from 'react';
import Modal from '@weco/common/views/components/Modal/Modal';
import Button from '@weco/common/views/components/Buttons';
import { UpdateUserSchema } from '../../types/schemas/update-user';
import { themeValues } from '@weco/common/views/themes/config';

export type ChangeDetailsModalContentProps =
  | Record<string, never>
  | {
      onCancel: () => void;
      onComplete: () => void;
      setIsModalLoading: (value: boolean) => void;
      isActive: boolean;
    };

type ChangeDetailsModalProps = {
  id: string;
  buttonText: string;
  onComplete: (newDetails?: UpdateUserSchema) => void;
  render: (props: ChangeDetailsModalContentProps) => ReactElement;
};

export const ChangeDetailsModal: FunctionComponent<ChangeDetailsModalProps> = ({
  id,
  buttonText,
  onComplete,
  render,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const openButton = useRef(null);

  const handleComplete = (newDetails?: UpdateUserSchema) => {
    onComplete(newDetails);
    setIsActive(false);
  };

  const close = () => setIsActive(false);

  return (
    <>
      <Button
        variant="ButtonSolid"
        colors={themeValues.buttonColors.greenTransparentGreen}
        text={buttonText}
        clickHandler={() => setIsActive(true)}
        ref={openButton}
      />
      <Modal
        id={id}
        isActive={isActive}
        setIsActive={setIsActive}
        openButtonRef={openButton}
        removeCloseButton={isModalLoading}
      >
        {render({
          onComplete: handleComplete,
          onCancel: close,
          isActive,
          setIsModalLoading,
        })}
      </Modal>
    </>
  );
};
