// @flow
import { useState, useRef, useEffect, type Node } from 'react';
import styled from 'styled-components';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';
import { classNames, font } from '../../../utils/classnames';

const UserInitiatedDialogOpen = styled(Space).attrs(props => ({
  'aria-hidden': props.isActive ? 'true' : 'false',
  tabIndex: props.isActive ? '-1' : '0',
  as: 'button',
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    [font('hnm', 5)]: true,
    'plain-button line-height-1 flex-inline flex--v-center bg-white font-purple': true,
  }),
}))`
  position: fixed;
  transform: ${props =>
    props.isActive || !props.shouldStartAnimation
      ? 'translateY(10px)'
      : 'translateY(0px)'};
  bottom: 20px;
  left: 20px;
  z-index: 1;
  opacity: ${props => (props.isActive || !props.shouldStartAnimation ? 0 : 1)};
  transition: opacity 500ms ease, filter 500ms ease, transform 500ms ease;
  transition-delay: ${props => (props.isActive ? '0ms' : '500ms')}
  border-radius: 9999px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3);

  &:hover,
  &:focus {
    background: ${props => props.theme.colors.purple};
    color: ${props => props.theme.colors.white};
    outline: 0;
    border: 0;

    .icon__shape {
      fill: ${props => props.theme.colors.white};
    }
  }
`;

const UserInitiatedDialogWindow = styled(Space).attrs(props => ({
  v: { size: 'l', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'bg-white font-purple': true,
  }),
}))`
  border-radius: 20px 0 20px 0;
  box-shadow: 0 2px 60px 0 rgba(0, 0, 0, 0.7);
  opacity: ${props => (props.isActive ? 1 : 0)};
  pointer-events: ${props => (props.isActive ? 'all' : 'none')};
  transform: ${props =>
    props.isActive ? 'translateY(0px)' : 'translateY(10px)'};
  transition: all 500ms ease;
  transition-delay: ${props => (props.isActive ? '500ms' : '0ms')}
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  max-width: 500px;
  z-index: ${props => (props.isActive ? 1 : 0)};
`;

const UserInitiatedDialogClose = styled.button.attrs({
  className: classNames({
    'absolute plain-button no-margin no-padding flex flex--v-center flex--h-center': true,
  }),
})`
  top: 10px;
  right: 10px;
`;

type Props = {|
  openButtonText: string,
  children: Node,
|};

const UserInitiatedDialog = ({ children, openButtonText }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const [shouldStartAnimation, setShouldStartAnimation] = useState(false);
  const openDialogRef = useRef(null);
  const closeDialogRef = useRef(null);
  const dialogWindowRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setShouldStartAnimation(true);
    }, 2000);
  }, []);

  function setTabbable(value) {
    const dialog = dialogWindowRef && dialogWindowRef.current;
    const tababbles = dialog && [
      ...dialog.querySelectorAll('a'),
      ...dialog.querySelectorAll('button'),
    ];

    tababbles &&
      tababbles.forEach(item =>
        item.setAttribute('tabindex', value ? '0' : '-1')
      );
  }

  return (
    <>
      <UserInitiatedDialogOpen
        title="open dialog"
        ref={openDialogRef}
        isActive={isActive}
        shouldStartAnimation={shouldStartAnimation}
        onClick={() => {
          setIsActive(true);
          setTabbable(true);
          closeDialogRef &&
            closeDialogRef.current &&
            closeDialogRef.current.focus();
        }}
      >
        <Space h={{ size: 's', properties: ['margin-right'] }}>
          <Icon name="chat" extraClasses="icon--purple" />
        </Space>
        {openButtonText}
      </UserInitiatedDialogOpen>
      <UserInitiatedDialogWindow ref={dialogWindowRef} isActive={isActive}>
        <UserInitiatedDialogClose
          title="close dialog"
          ref={closeDialogRef}
          onClick={() => {
            setIsActive(false);
            setTabbable(false);
            openDialogRef &&
              openDialogRef.current &&
              openDialogRef.current.focus();
          }}
        >
          <Icon name="clear" title="Close dialog" extraClasses="icon--purple" />
        </UserInitiatedDialogClose>
        {children}
      </UserInitiatedDialogWindow>
    </>
  );
};

export default UserInitiatedDialog;
