// @flow
import { type Node, useEffect, useRef, useContext } from 'react';
import useFocusTrap from '../../../hooks/useFocusTrap';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import { AppContext } from '../AppContext/AppContext';
import getFocusableElements from '@weco/common/utils/get-focusable-elements';

type Props = {|
  children: Node,
  isActive: boolean,
  setIsActive: (value: boolean) => void,
  width?: string,
|};

const Overlay = styled.div`
  z-index: 1000;
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
    'shadow bg-white': true,
  }),
})`
  z-index: 1001;
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
    max-width: ${props.width || `${props.theme.sizes.large}px`}
    width: ${props.width || 'auto'};
    border-radius: ${props.theme.borderRadiusUnit}px;
  `}
`;

const Modal = ({ children, isActive, setIsActive, width = null }: Props) => {
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
    if (document && document.documentElement) {
      if (isActive) {
        document.documentElement.classList.add('is-scroll-locked');
      } else {
        document.documentElement.classList.remove('is-scroll-locked');
      }
    }
  }, [isActive]);

  useFocusTrap(closeButtonRef, endRef);

  return (
    <>
      {isActive && <Overlay onClick={() => setIsActive(false)} />}
      {isActive && (
        <ModalWindow ref={modalRef} width={width}>
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
      )}
    </>
  );
};

export default Modal;
