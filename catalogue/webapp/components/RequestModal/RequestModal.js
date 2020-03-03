import { useState } from 'react';
import Button from '@weco/common/views/components/Buttons/Button/Button';
import Modal from '@weco/common/views/components/Modal/Modal';

type Props = {| workId: string |};
const RequestModal = ({ workId }: Props) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <>
      <div data-test-id="requestModalCTA">
        <Button
          type="primary"
          text="Request"
          clickHandler={() => {
            setIsActive(true);
          }}
        />
      </div>
      <Modal isActive={isActive} setIsActive={setIsActive}>
        Baby Hayley
      </Modal>
    </>
  );
};

export default RequestModal;
