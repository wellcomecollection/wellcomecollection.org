// @flow
import { type Node, useEffect, useRef, useContext, createContext } from 'react';
import useFocusTrap from '../../../hooks/useFocusTrap';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
// $FlowFixMe (tsx)
import { AppContext } from '../AppContext/AppContext';
import getFocusableElements from '@weco/common/utils/get-focusable-elements';
import { CSSTransition } from 'react-transition-group';
export const ModalContext = createContext<{|
  updateLastFocusableRef: ?(HTMLElement) => void,
|}>({ updateLastFocusableRef: null });

type Props = {|
  children: Node,
  isActive: boolean,
  setIsActive: (value: boolean) => void,
  width?: string,
  id: string,
  openButtonRef: { current: HTMLElement | null },
  removeCloseButton?: boolean,
|};

const Overlay = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  ${props => props.theme.media.medium`
    background: rgba(0, 0, 0, 0.7);
  `}
`;

const CloseButton = styled(Space).attrs({
  role: 'button',
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
  color: ${props => props.theme.color('white')};
  border: 0;
  outline: 0;
  z-index: 1;

  &:focus {
    ${props =>
      !props.hideFocus && `border: 2px solid ${props.theme.color('black')}`}
  }

  .icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  ${props => props.theme.media.medium`
    background: none;
    color: ${props => props.theme.color('pewter')};
    position: absolute;
  `}
`;

const ModalWindow = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'shadow bg-white font-black': true,
  }),
})`
  z-index: 10001;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  overflow: auto;
  transition: opacity 350ms ease, transform 350ms ease;

  &,
  &.fade-exit-done {
    z-index: -1;
    pointer-events: none;
  }
  &.fade-enter,
  &.fade-exit,
  &.fade-enter-done {
    z-index: 1001;
    pointer-events: all;
  }
  &,
  &.fade-enter,
  &.fade-exit-active,
  &.fade-exit-done {
    opacity: 0;
    transform: scale(0.9);
  }
  &.fade-enter-active,
  &.fade-enter-done {
    opacity: 1;
    transform: scale(1);
  }

  ${props => props.theme.media.medium`
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    height: auto;
    max-height: 90vh;
    max-width: ${props.width || `${props.theme.sizes.large}px`}
    width: ${props.width || 'auto'};
    border-radius: ${props.theme.borderRadiusUnit}px;

    &,
    &.fade-enter,
    &.fade-exit-active,
    &.fade-exit-done {
      transform: scale(0.9) translateX(-50%) translateY(-50%);
    }
    &.fade-enter-active,
    &.fade-enter-done {
      opacity: 1;
      transform: scale(1) translateX(-50%) translateY(-50%);
    }
  `}
  @media screen and (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const Modal = ({
  children,
  isActive,
  setIsActive,
  width = null,
  id,
  openButtonRef,
  removeCloseButton = false,
}: Props) => {
  const closeButtonRef = useRef(null);
  const lastFocusableRef = useRef(null);
  const modalRef = useRef(null);
  const { isKeyboard } = useContext(AppContext);

  function updateLastFocusableRef(newRef) {
    lastFocusableRef.current = newRef;
  }

  function closeModal() {
    setIsActive(false);
    openButtonRef && openButtonRef.current && openButtonRef.current.focus();
  }

  useEffect(() => {
    const focusables = modalRef &&
      modalRef.current && [...getFocusableElements(modalRef.current)];
    lastFocusableRef.current = focusables && focusables[focusables.length - 1];
  }, [modalRef.current]);

  useEffect(() => {
    if (isActive && closeButtonRef && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isActive]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;

      closeModal();
    }
    if (!removeCloseButton) {
      document.addEventListener('keydown', closeOnEscape);

      return () => document.removeEventListener('keydown', closeOnEscape);
    }
  }, []);

  useEffect(() => {
    if (document && document.documentElement) {
      if (isActive) {
        document.documentElement.classList.add('is-scroll-locked');
      } else {
        document.documentElement.classList.remove('is-scroll-locked');
      }
    }
  }, [isActive]);

  useFocusTrap(closeButtonRef, lastFocusableRef);

  return (
    <>
      {isActive && (
        <Overlay
          onClick={() => {
            if (!removeCloseButton) {
              closeModal();
            }
          }}
        />
      )}
      <CSSTransition in={isActive} classNames="fade" timeout={350}>
        <ModalWindow ref={modalRef} width={width} id={id} hidden={!isActive}>
          {!removeCloseButton && (
            <CloseButton
              ref={closeButtonRef}
              onClick={closeModal}
              hideFocus={!isKeyboard}
            >
              <span className="visually-hidden">Close modal window</span>
              <Icon name="cross" extraClasses={`icon--currentColor`} />
            </CloseButton>
          )}
          <ModalContext.Provider value={{ updateLastFocusableRef }}>
            {children}
          </ModalContext.Provider>
        </ModalWindow>
      </CSSTransition>
    </>
  );
};

export default Modal;
