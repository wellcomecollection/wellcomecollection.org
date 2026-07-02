import { FocusTrap } from 'focus-trap-react';
import {
  FunctionComponent,
  MutableRefObject,
  PropsWithChildren,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CSSTransition } from 'react-transition-group';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { cross } from '@weco/common/icons';
import { ACTIVE_COOKIE_BANNER_ID } from '@weco/common/services/app/civic-uk';
import { dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import Icon from '@weco/common/views/components/Icon';

import {
  BaseModalWindow,
  CalendarModal,
  CloseButton,
  FiltersModal,
  InactivityModal,
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
  openButtonRef?: MutableRefObject<HTMLElement | null>;
  removeCloseButton?: boolean;
  showOverlay?: boolean;
  modalStyle?: 'filters' | 'calendar' | 'video' | 'inactivity';
}>;

function determineModal(modalStyle: Props['modalStyle']) {
  switch (modalStyle) {
    case 'filters':
      return FiltersModal;
    case 'calendar':
      return CalendarModal;
    case 'video':
      return VideoModal;
    case 'inactivity':
      return InactivityModal;
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
  const [visualViewportStyle, setVisualViewportStyle] =
    useState<React.CSSProperties>({});

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

  // VisualViewport positioning (see Modal.styles.tsx for the base styles this overrides):
  // position:fixed is relative to the layout viewport, which does not move when
  // the user pinch-zooms. The VisualViewport API gives us the coordinates of the
  // actual visible area, so we can override top/left/maxWidth/maxHeight to keep
  // the modal centred within what the user can actually see.
  useEffect(() => {
    if (modalStyle !== 'inactivity' || !isActive) {
      setVisualViewportStyle({});
      return;
    }

    if (typeof window === 'undefined' || !window.visualViewport) {
      return;
    }

    const updatePosition = () => {
      const vv = window.visualViewport;
      if (!vv) return;

      // Calculate position to center the modal in the visual viewport
      // Use fixed positioning relative to the visual viewport
      const style: React.CSSProperties = {
        position: 'fixed',
        top: `${vv.offsetTop + vv.height / 2}px`,
        left: `${vv.offsetLeft + vv.width / 2}px`,
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        maxWidth: `${Math.min(550, vv.width * 0.9)}px`,
        maxHeight: `${vv.height * 0.9}px`,
        width: '80%',
      };

      setVisualViewportStyle(style);
    };

    // Update position initially and on viewport changes
    updatePosition();

    window.visualViewport.addEventListener('resize', updatePosition);
    window.visualViewport.addEventListener('scroll', updatePosition, {
      passive: true,
    });

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updatePosition);
        window.visualViewport.removeEventListener('scroll', updatePosition);
      }
    };
  }, [modalStyle, isActive]);

  return (
    <FocusTrap
      active={isActive && hasAcknowledgedCookieBanner}
      focusTrapOptions={{ preventScroll: true }}
    >
      <div data-component="modal">
        {isActive && showOverlay && (
          <Overlay
            data-lock-scroll="true"
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
            style={visualViewportStyle}
          >
            {!removeCloseButton && (
              <CloseButton
                data-testid="close-modal-button"
                {...dataGtmPropsToAttributes({ id: 'close-modal-button' })}
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
