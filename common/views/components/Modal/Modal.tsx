import {
  ReactNode,
  useEffect,
  useRef,
  useContext,
  createContext,
  FunctionComponent,
  RefObject,
  createRef,
  MutableRefObject,
} from 'react';
import useFocusTrap from '../../../hooks/useFocusTrap';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import { AppContext } from '../AppContext/AppContext';
import getFocusableElements from '@weco/common/utils/get-focusable-elements';
import { CSSTransition } from 'react-transition-group';
import { cross } from '@weco/common/icons';
export const ModalContext = createContext<{
  updateLastFocusableRef: (arg0: HTMLElement | null) => void | null | undefined;
}>({
  updateLastFocusableRef: () => null,
});

type CloseButtonProps = {
  hideFocus: boolean;
};

type BaseModalProps = {
  width?: string | null;
};

type Props = {
  children: ReactNode;
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  width?: string | null;
  id: string;
  openButtonRef: MutableRefObject<HTMLElement | null>;
  removeCloseButton?: boolean;
  showOverlay?: boolean;
  modalStyle?: 'filters' | 'calendar' | 'default';
};
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

const CloseButton = styled(Space).attrs<CloseButtonProps>({
  as: 'button',
  type: 'button',
  v: { size: 'm', properties: ['top'] },
  h: { size: 'm', properties: ['left'] },
})<CloseButtonProps>`
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

const BaseModalWindow = styled(Space).attrs<BaseModalProps>({
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'shadow bg-white': true,
  }),
})<BaseModalProps>`
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
    max-width: ${props.width || `${props.theme.sizes.large}px`};
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

const FiltersModal = styled(BaseModalWindow).attrs<BaseModalProps>({
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  className: classNames({
    'shadow bg-white': true,
  }),
})<BaseModalProps>`
  overflow: hidden;
  padding-left: 0px;
  padding-right: 0px;
`;

const CalendarModal = styled(BaseModalWindow)`
  padding: 0;
  right: 0;
  @media (min-width: ${props => props.theme.sizes.medium}px) {
    width: 300px;
  }
  @media (min-width: ${props => props.theme.sizes.large}px) {
    left: auto;
  }
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
  id,
  openButtonRef,
  removeCloseButton = false,
  showOverlay = true,
  modalStyle = 'default',
}: Props) => {
  const closeButtonRef: RefObject<HTMLInputElement> = useRef(null);
  const firstFocusableRef = useRef<HTMLInputElement | undefined>(null);
  const lastFocusableRef = useRef<HTMLInputElement | undefined>(null);
  const modalRef: RefObject<HTMLInputElement> = createRef();
  const { isKeyboard } = useContext(AppContext);
  const ModalWindow = determineModal(modalStyle);
  const initialLoad = useRef(true);

  function updateLastFocusableRef(newRef: HTMLInputElement) {
    lastFocusableRef.current = newRef;
  }

  useEffect(() => {
    const focusables: HTMLInputElement[] | null = modalRef &&
      modalRef.current && [
        ...getFocusableElements<HTMLInputElement>(modalRef.current),
      ];
    firstFocusableRef.current = focusables?.[0];
    lastFocusableRef.current = focusables?.[focusables.length - 1];
  }, [modalRef.current]);

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

  useFocusTrap(
    closeButtonRef.current ? closeButtonRef : firstFocusableRef,
    lastFocusableRef!
  );

  return (
    <>
      {isActive && showOverlay && (
        <Overlay
          onClick={() => {
            if (!removeCloseButton) {
              setIsActive(false);
            }
          }}
        />
      )}
      <CSSTransition in={isActive} classNames="fade" timeout={350}>
        <ModalWindow ref={modalRef} width={width} id={id} hidden={!isActive}>
          {!removeCloseButton && (
            <CloseButton
              data-testid="close-modal-button"
              ref={closeButtonRef}
              onClick={() => {
                setIsActive(false);
              }}
              hideFocus={!isKeyboard}
            >
              <span className="visually-hidden">Close modal window</span>
              <Icon icon={cross} color={'currentColor'} />
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
