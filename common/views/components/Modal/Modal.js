// @flow

import { type Node } from 'react';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';

type Props = {|
  children: Node,
  isActive: Boolean,
  setIsActive: (value: boolean) => void,
|};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
`;

const CloseButton = styled(Space).attrs({
  as: 'button',
  v: { size: 'm', properties: ['top'] },
  h: { size: 'm', properties: ['left'] },
})`
  position: fixed;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  appearance: none;
  background: rgba(0, 0, 0, 0.7);
  color: ${props => props.theme.colors.white};
  border: 0;
  outline: 0;
  z-index: 1;

  .icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  ${props => props.theme.media.medium`
    background: none;
    color: ${props => props.theme.colors.pewter};
    position: absolute;
  `}
`;

const ModalWindow = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'shadow bg-white': true,
  }),
})`
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  overflow: auto;

  ${props => props.theme.media.medium`
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    transform: translateX(-50%) translateY(-50%);
    height: auto;
    max-height: 90vh;
    max-width: ${props.theme.sizes.large}px
    border-radius: ${props.theme.borderRadiusUnit}px;
    display: flex;
  `}
`;

const Modal = ({ children, isActive, setIsActive }: Props) => {
  return isActive ? (
    <>
      <Overlay />
      <ModalWindow>
        <CloseButton onClick={() => setIsActive(false)}>
          <span className="visually-hidden">Close modal window</span>
          <Icon name="cross" extraClasses={`icon--currentColor`} />
        </CloseButton>
        {children}
      </ModalWindow>
    </>
  ) : null;
};

export default Modal;
