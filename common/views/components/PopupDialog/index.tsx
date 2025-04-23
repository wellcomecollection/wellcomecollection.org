import { hasCookie, setCookie } from 'cookies-next';
import {
  FunctionComponent,
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import cookies from '@weco/common/data/cookies';
import { chat, clear } from '@weco/common/icons';
import { PopupDialogDocument as RawPopupDialogDocument } from '@weco/common/prismicio-types';
import { transformLink } from '@weco/common/services/prismic/transformers';
import { InferDataInterface } from '@weco/common/services/prismic/types';
import { font } from '@weco/common/utils/classnames';
import getFocusableElements from '@weco/common/utils/get-focusable-elements';
import Icon from '@weco/common/views/components/Icon';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';

type PopupDialogOpenProps = {
  $shouldStartAnimation: boolean;
  $isActive: boolean;
};
const PopupDialogOpen = styled(Space).attrs<PopupDialogOpenProps>(props => ({
  'aria-hidden': props.$isActive ? 'true' : 'false',
  'aria-controls': 'user-initiated-dialog-window',
  as: 'button',
  $v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
    overrides: { small: 4, medium: 4, large: 4 },
  },
  $h: {
    size: 'm',
    properties: ['padding-left', 'padding-right'],
    overrides: { small: 5, medium: 5, large: 5 },
  },
  className: font('intb', 5),
}))<PopupDialogOpenProps>`
  line-height: 1;
  display: inline-flex;
  align-items: center;
  color: ${props => props.theme.color('accent.purple')};
  position: fixed;
  transform: ${props =>
    props.$isActive || !props.$shouldStartAnimation
      ? 'translateY(10px)'
      : 'translateY(0)'};
  bottom: 20px;
  left: 20px;
  z-index: 3;
  background: ${props => props.theme.color('white')};
  opacity: ${props =>
    props.$isActive || !props.$shouldStartAnimation ? 0 : 1};
  transition:
    opacity 500ms ease,
    filter 500ms ease,
    transform 500ms ease;
  transition-delay: ${props => (props.$isActive ? '0ms' : '500ms')};
  border-radius: 9999px;
  box-shadow: 0 4px 8px 0 rgb(0, 0, 0, 0.3);

  &:hover {
    border: 0;
    color: ${props => props.theme.color('white')};
    background: ${props => props.theme.color('accent.purple')};

    .icon__shape {
      fill: ${props => props.theme.color('white')};
    }
  }
`;

type PopupDialogWindowProps = {
  $isActive: boolean;
};
const PopupDialogWindow = styled(Space).attrs({
  'aria-modal': true,
  id: 'user-initiated-dialog-window',
  $v: {
    size: 'l',
    properties: ['padding-top', 'padding-bottom'],
    overrides: { small: 6, medium: 6, large: 6 },
  },
  $h: {
    size: 'l',
    properties: ['padding-left', 'padding-right'],
    overrides: { small: 6, medium: 6, large: 6 },
  },
})<PopupDialogWindowProps>`
  background-color: ${props => props.theme.color('white')};
  color: ${props => props.theme.color('accent.purple')};
  border-radius: 20px 0;
  box-shadow: 0 2px 60px 0 rgb(0, 0, 0, 0.7);
  opacity: ${props => (props.$isActive ? 1 : 0)};
  pointer-events: ${props => (props.$isActive ? 'all' : 'none')};
  transform: ${props =>
    props.$isActive ? 'translateY(0)' : 'translateY(10px)'};
  transition:
    opacity 500ms ease,
    transform 500ms ease;
  transition-delay: ${props => (props.$isActive ? '500ms' : '0ms')};
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  max-width: 370px;
  z-index: 3;
`;

const PopupDialogClose = styled.button`
  margin: 0 !important;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: 10px;
  right: 10px;
`;

const PopupDialogCTA = styled(Space).attrs({
  as: 'a',
  $v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
    overrides: { small: 3, medium: 3, large: 3 },
  },
  $h: {
    size: 'm',
    properties: ['padding-left', 'padding-right'],
    overrides: { small: 5, medium: 5, large: 5 },
  },
  className: font('intb', 5, { small: 3, medium: 3 }),
})`
  display: inline-block;
  background-color: ${props => props.theme.color('accent.purple')};
  color: ${props => props.theme.color('white')};
  transition: all 500ms ease;
  border: 2px solid transparent;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.color('accent.purple')};
    border-color: ${props => props.theme.color('accent.purple')};
    background: ${props => props.theme.color('white')};
  }
`;

type Props = {
  document: { data: InferDataInterface<RawPopupDialogDocument> };
};

const PopupDialog: FunctionComponent<Props> = ({ document }: Props) => {
  const { link, linkText, openButtonText, text, title } = document.data;
  const [shouldRender, setShouldRender] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const isActiveRef = useRef(isActive);
  const [shouldStartAnimation, setShouldStartAnimation] = useState(false);
  const openDialogRef = useRef<HTMLDivElement>(null);
  const closeDialogRef = useRef<HTMLButtonElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const dialogWindowRef = useRef<HTMLDivElement>(null);

  function hasPersistentState() {
    const cardiganHosts = ['localhost:9001', 'cardigan.wellcomecollection.org'];

    return cardiganHosts.includes(window.location.host);
  }

  function hidePopupDialog() {
    if (hasPersistentState()) return;

    setCookie(cookies.popupDialog, 'true', {
      path: '/',
      expires: undefined,
      secure: true,
    });

    setShouldRender(false);
  }

  useEffect(() => {
    setShouldRender(
      hasPersistentState() ? true : !hasCookie(cookies.popupDialog)
    );

    const timer = setTimeout(() => {
      setShouldStartAnimation(true);
    }, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    isActiveRef.current = isActive;

    window.document.addEventListener('click', handleBodyClick);
    window.document.addEventListener('keydown', handleEscapeKeyDown);

    return () => {
      window.document.removeEventListener('click', handleBodyClick);
      window.document.removeEventListener('keydown', handleEscapeKeyDown);
    };
  }, [isActive]);

  function handleBodyClick(event: MouseEvent) {
    const dialog = dialogWindowRef && dialogWindowRef.current;
    const openDialog = openDialogRef && openDialogRef.current;

    if (openDialog === event.target) return;

    if (
      dialog &&
      isActiveRef.current &&
      !dialog.contains(event.target as HTMLDivElement)
    ) {
      setIsActive(false);
      openDialogRef && openDialogRef.current && openDialogRef.current.focus();
    }
  }

  function handleEscapeKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 27 && isActiveRef.current) {
      setIsActive(false);
      openDialogRef && openDialogRef.current && openDialogRef.current.focus();
    }
  }

  function handleTrapStartKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>
  ) {
    if (event.shiftKey && event.keyCode === 9) {
      event.preventDefault();
      ctaRef && ctaRef.current && ctaRef.current.focus();
    }
  }

  function handleTrapEndKeyDown(event: ReactKeyboardEvent<HTMLAnchorElement>) {
    if (!event.shiftKey && event.keyCode === 9) {
      event.preventDefault();
      closeDialogRef &&
        closeDialogRef.current &&
        closeDialogRef.current.focus();
    }
  }

  function setFocusable(value: boolean) {
    const dialog = dialogWindowRef && dialogWindowRef.current;
    const focusables = dialog && getFocusableElements<HTMLDivElement>(dialog);

    focusables &&
      focusables.forEach(item =>
        item.setAttribute('tabindex', value ? '0' : '-1')
      );
  }

  return shouldRender ? (
    <>
      <PopupDialogOpen
        title="open dialog"
        ref={openDialogRef}
        tabIndex={isActive ? -1 : 0}
        $shouldStartAnimation={shouldStartAnimation}
        $isActive={isActive}
        onClick={() => {
          setIsActive(true);
          setFocusable(true);
          closeDialogRef &&
            closeDialogRef.current &&
            closeDialogRef.current.focus();
        }}
      >
        <Space
          $h={{
            size: 's',
            properties: ['margin-right'],
            overrides: { medium: 2, large: 2 },
          }}
        >
          <Icon icon={chat} iconColor="accent.purple" />
        </Space>
        {openButtonText}
      </PopupDialogOpen>
      <PopupDialogWindow ref={dialogWindowRef} $isActive={isActive}>
        <PopupDialogClose
          title="close dialog"
          ref={closeDialogRef}
          tabIndex={isActive ? 0 : -1}
          onKeyDown={handleTrapStartKeyDown}
          onClick={() => {
            setIsActive(false);
            setFocusable(false);
            openDialogRef &&
              openDialogRef.current &&
              openDialogRef.current.focus();
          }}
        >
          <Icon icon={clear} title="Close dialog" iconColor="accent.purple" />
        </PopupDialogClose>
        <Space
          $h={{
            size: 'm',
            properties: ['padding-right'],
            overrides: { small: 4, medium: 4, large: 4 },
          }}
        >
          <h2
            className={font('wb', 6, {
              small: 5,
              medium: 5,
              large: 5,
            })}
          >
            {title}
          </h2>
          <div className={font('intr', 5, { medium: 2, large: 2 })}>
            <PrismicHtmlBlock html={text} />
          </div>
        </Space>
        <PopupDialogCTA
          href={transformLink(link)}
          ref={ctaRef}
          tabIndex={isActive ? 0 : -1}
          onKeyDown={handleTrapEndKeyDown}
          onClick={hidePopupDialog}
          as="a"
        >
          {linkText}
        </PopupDialogCTA>
      </PopupDialogWindow>
    </>
  ) : null;
};

export default PopupDialog;
