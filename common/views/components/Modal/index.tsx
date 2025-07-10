import { FocusTrap } from 'focus-trap-react';
import {
  FunctionComponent,
  MutableRefObject,
  PropsWithChildren,
  RefObject,
  useEffect,
  useRef,
} from 'react';
import { CSSTransition } from 'react-transition-group';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { cross } from '@weco/common/icons';
import { ACTIVE_COOKIE_BANNER_ID } from '@weco/common/services/app/civic-uk';
import Icon from '@weco/common/views/components/Icon';

import {
  BaseModalWindow,
  CalendarModal,
  CloseButton,
  FiltersModal,
  Overlay,
  VideoModal,
} from './Modal.styles';

type Props = PropsWithChildren<{
  isActive: boolean;
  setIsActive: (value: boolean) => void;
  width?: string | null;
  maxWidth?: string;
  id: string;
  dataTestId?: string;
  dataLockScroll: boolean;
  openButtonRef?: MutableRefObject<HTMLElement | null>;
  removeCloseButton?: boolean;
  showOverlay?: boolean;
  modalStyle?: 'filters' | 'calendar' | 'video';
}>;

function determineModal(modalStyle: Props['modalStyle']) {
  switch (modalStyle) {
    case 'filters':
      return FiltersModal;
    case 'calendar':
      return CalendarModal;
    case 'video':
      return VideoModal;
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
  dataTestId,
  openButtonRef,
  removeCloseButton = false,
  showOverlay = true,
  modalStyle,
}: Props) => {
  const closeButtonRef: RefObject<HTMLInputElement | null> = useRef(null);
  const ModalWindow = determineModal(modalStyle);
  const initialLoad = useRef(true);
  const nodeRef = useRef(null);
  const { hasAcknowledgedCookieBanner, setHasAcknowledgedCookieBanner } =
    useAppContext();

  useEffect(() => {
    if (isActive) {
      // There can be a sort of race condition between modals and the cookie banner,
      // so we need to check here too if it is active.
      // The overlay element is visible if the banner or the popup is actively showing.
      if (document.getElementById(ACTIVE_COOKIE_BANNER_ID)) {
        setHasAcknowledgedCookieBanner(false);
      } else {
        closeButtonRef?.current?.focus();
      }
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

  return (
    <FocusTrap
      active={isActive && hasAcknowledgedCookieBanner}
      focusTrapOptions={{ preventScroll: true }}
    >
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
            data-testid={dataTestId}
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
            {children}
          </ModalWindow>
        </CSSTransition>
      </div>
    </FocusTrap>
  );
};

export default Modal;
