import { FunctionComponent, RefObject } from 'react';
import Modal from '@weco/common/views/components/Modal/Modal';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import styled from 'styled-components';
import { PhysicalItem, Work } from '@weco/common/model/catalogue';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

type Props = {
  work: Work;
  item: PhysicalItem;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  id: string;
  openButtonRef: RefObject<HTMLButtonElement>;
};

const ConfirmItemRequest: FunctionComponent<Props> = props => {
  const { item, work, ...modalProps } = props;

  return (
    <Modal {...modalProps}>
      <Header>
        <span>Request item</span>
        <span>7/10 items remaining</span>
      </Header>
      <p>You are about to request the following item:</p>
      <p>
        {work.title && <span className="block">{work.title}</span>}
        {item.title && <span>{item.title}</span>}
      </p>
      <ButtonSolid text={`Confirm request`} />
      <a>Cancel request</a>
    </Modal>
  );
};

export default ConfirmItemRequest;
