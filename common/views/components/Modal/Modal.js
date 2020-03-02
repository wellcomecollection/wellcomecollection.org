// @flow
import { type Node, useEffect, useRef, useContext } from 'react';
import useFocusTrap from '../../../hooks/useFocusTrap';
import styled from 'styled-components';
import { CSSTransition } from 'react-transition-group';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import { AppContext } from '../AppContext/AppContext';
import getFocusableElements from '@weco/common/utils/get-focusable-elements';

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

  &:focus {
    ${props =>
      !props.hideFocus && `border: 2px solid ${props.theme.colors.black}`}
  }

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
  transition: opacity 350ms ease;

  &,
  &.fade-exit-done {
    z-index: -1;
    pointer-events: none;
  }

  &.fade-enter,
  &.fade-exit,
  &.fade-enter-done {
    z-index: 2;
    pointer-events: all;
  }

  &,
  &.fade-enter,
  &.fade-exit-active,
  &.fade-exit-done {
    opacity: 0;
  }

  &.fade-enter-active,
  &.fade-enter-done {
    opacity: 1;
  }

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
  const closeButtonRef = useRef(null);
  const endRef = useRef(null);
  const modalRef = useRef(null);
  const { isKeyboard } = useContext(AppContext);

  useEffect(() => {
    const focusables = modalRef &&
      modalRef.current && [...getFocusableElements(modalRef.current)];
    endRef.current = focusables && focusables[focusables.length - 1];
  }, [modalRef.current]);

  useEffect(() => {
    if (isActive && closeButtonRef && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isActive]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;

      setIsActive(false);
    }

    document.addEventListener('keydown', closeOnEscape);

    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    document &&
      document.documentElement &&
      document.documentElement.classList[isActive ? 'add' : 'remove'](
        'is-scroll-locked'
      );
  }, [isActive]);

  useFocusTrap(closeButtonRef, endRef);

  return (
    <>
      {isActive && <Overlay onClick={() => setIsActive(false)} />}
      <CSSTransition in={isActive} classNames="fade" timeout={350}>
        <ModalWindow ref={modalRef}>
          <CloseButton
            ref={closeButtonRef}
            onClick={() => setIsActive(false)}
            hideFocus={!isKeyboard}
          >
            <span className="visually-hidden">Close modal window</span>
            <Icon name="cross" extraClasses={`icon--currentColor`} />
          </CloseButton>
          {children}
        </ModalWindow>
      </CSSTransition>
    </>
  );
};

export default Modal;
