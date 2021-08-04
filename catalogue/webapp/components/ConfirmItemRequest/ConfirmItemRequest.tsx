import { FunctionComponent, RefObject } from 'react';
import Modal from '@weco/common/views/components/Modal/Modal';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ButtonOutlined from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { PhysicalItem, Work } from '@weco/common/model/catalogue';
import { classNames, font } from '@weco/common/utils/classnames';

const Header = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom'] },
})`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Remaining = styled(Space).attrs({
  h: { size: 's', properties: ['padding-left'] },
})`
  border-left: 5px solid ${props => props.theme.color('yellow')};
`;

const CTAs = styled(Space).attrs({
  v: { size: 'l', properties: ['margin-top'] },
})``;

type Props = {
  work: Work;
  item: PhysicalItem;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  id: string;
  openButtonRef: RefObject<HTMLButtonElement>;
};

const ConfirmItemRequest: FunctionComponent<Props> = props => {
  const { item, work, setIsActive, ...modalProps } = props;

  return (
    <Modal {...modalProps} setIsActive={setIsActive}>
      <Header>
        <span className={`h2`}>Request item</span>
        <Remaining>7/15 items remaining</Remaining>
      </Header>
      <p
        className={classNames({
          [font('hnb', 5)]: true,
          'no-margin': true,
        })}
      >
        You are about to request the following item:
      </p>
      <p className={'no-margin'}>
        {work.title && <span className="block">{work.title}</span>}
        {item.title && <span>{item.title}</span>}
      </p>
      <CTAs>
        <Space
          h={{ size: 'l', properties: ['margin-right'] }}
          className={'inline-block'}
        >
          <ButtonSolid text={`Confirm request`} />
        </Space>
        <ButtonOutlined
          text={`Cancel request`}
          clickHandler={() => setIsActive(false)}
        />
      </CTAs>
    </Modal>
  );
};

export default ConfirmItemRequest;
