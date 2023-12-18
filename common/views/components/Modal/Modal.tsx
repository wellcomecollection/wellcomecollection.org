import {
  useEffect,
  useRef,
  FunctionComponent,
  RefObject,
  MutableRefObject,
  PropsWithChildren,
} from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';
import { CSSTransition } from 'react-transition-group';
import { cross } from '@weco/common/icons';
import FocusTrap from 'focus-trap-react';

type BaseModalProps = {
  $width?: string | null;
  $maxWidth?: string;
};

type Props = PropsWithChildren<{
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  width?: string | null;
  maxWidth?: string;
  id: string;
  openButtonRef?: MutableRefObject<HTMLElement | null>;
  removeCloseButton?: boolean;
  showOverlay?: boolean;
  modalStyle?: 'filters' | 'calendar';
}>;

const Overlay = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  ${props => props.theme.media('medium')`
    background: rgba(0, 0, 0, 0.7);
  `}
`;

const CloseButton = styled(Space).attrs<{ type: string }>({
  as: 'button',
  type: 'button',
  $v: { size: 'm', properties: ['top'] },
  $h: { size: 'm', properties: ['left'] },
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

  .icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  ${props =>
    props.theme.media('medium')(`
    background: none;
    color: ${props.theme.color('neutral.600')};
    position: absolute;
  `)}
`;

const BaseModalWindow = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
})<BaseModalProps>`
  z-index: 10001;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  overflow: auto;
  transition:
    opacity 350ms ease,
    transform 350ms ease;
  background-color: ${props => props.theme.color('white')};
  box-shadow: ${props => props.theme.basicBoxShadow};

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

  ${props =>
    props.theme.media('medium')(`
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    height: auto;
    max-height: 90vh;
    max-width: ${
      props.$maxWidth || props.$width || `${props.theme.sizes.large}px`
    };
    width: ${(props.$maxWidth && '80%') || props.$width || 'auto'};
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
  `)}
  @media screen and (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

const FiltersModal = styled(BaseModalWindow).attrs({
  $v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
})`
  overflow: hidden;
  padding-left: 0;
  padding-right: 0;
  box-shadow: ${props => props.theme.basicBoxShadow};
`;

const CalendarModal = styled(BaseModalWindow)`
  padding: 0;
  right: 0;
  ${props => props.theme.media('medium')`
    width: 300px;
  `}
  ${props => props.theme.media('large')`
    left: auto;
  `}
`;

function determineModal(modalStyle: Props['modalStyle']) {
  switch (modalStyle) {
    case 'filters':
      return FiltersModal;
    case 'calendar':
      return CalendarModal;
    default:
      return BaseModalWindow;
  }
}

const Modal: FunctionComponent<Props> = ({
  children,
  isActive,
  setIsActive,
  width = null,
  maxWidth,
  id,
  openButtonRef,
  removeCloseButton = false,
  showOverlay = true,
  modalStyle,
}: Props) => {
  const closeButtonRef: RefObject<HTMLInputElement> = useRef(null);
  const ModalWindow = determineModal(modalStyle);
  const initialLoad = useRef(true);
  const nodeRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      closeButtonRef?.current?.focus();
    } else if (!initialLoad.current) {
      openButtonRef && openButtonRef.current && openButtonRef.current.focus();
    }
    initialLoad.current = false;
  }, [isActive]);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isActive) {
        setIsActive(false);
      }
    }
    if (!removeCloseButton) {
      document.addEventListener('keydown', closeOnEscape);

      return () => document.removeEventListener('keydown', closeOnEscape);
    }
  }, [isActive]);

  useEffect(() => {
    if (document && document.documentElement) {
      if (isActive) {
        document.documentElement.classList.add('is-scroll-locked');
      } else {
        document.documentElement.classList.remove('is-scroll-locked');
      }
    }

    return () => {
      document.documentElement.classList.remove('is-scroll-locked');
    };
  }, [isActive]);

  return (
    <FocusTrap active={isActive} focusTrapOptions={{ preventScroll: true }}>
      <div>
        {isActive && showOverlay && (
          <Overlay
            onClick={() => {
              if (!removeCloseButton) {
                setIsActive(false);
              }
            }}
          />
        )}
        <CSSTransition
          in={isActive}
          classNames="fade"
          timeout={350}
          nodeRef={nodeRef}
        >
          <ModalWindow
            id={id}
            hidden={!isActive}
            ref={nodeRef}
            $width={width}
            $maxWidth={maxWidth}
          >
            {!removeCloseButton && (
              <CloseButton
                data-testid="close-modal-button"
                ref={closeButtonRef}
                onClick={() => {
                  setIsActive(false);
                }}
              >
                <span className="visually-hidden">Close modal window</span>
                <Icon icon={cross} />
              </CloseButton>
            )}
            {/* The Modal element needs to be pre-rendered even if inactive for its CSSTransition effect
            But there's a bit of rerending that's possible within its children that could affect the pages
            even when the modal is not active, so hiding if not. */}
            {isActive && children}
          </ModalWindow>
        </CSSTransition>
      </div>
    </FocusTrap>
  );
};

export default Modal;
