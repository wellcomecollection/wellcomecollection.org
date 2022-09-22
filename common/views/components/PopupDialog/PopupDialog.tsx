import {
  FunctionComponent,
  useState,
  useRef,
  useEffect,
  useContext,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import styled from 'styled-components';
import cookie from 'cookie-cutter';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';
import { font } from '../../../utils/classnames';
import getFocusableElements from '../../../utils/get-focusable-elements';
import { trackEvent } from '../../../utils/ga';
import { AppContext } from '../AppContext/AppContext';
import { PopupDialogPrismicDocument } from '../../../services/prismic/documents';
import PrismicHtmlBlock from '../PrismicHtmlBlock/PrismicHtmlBlock';
import { chat, clear } from '../../../icons';
import { InferDataInterface } from '../../../services/prismic/types';
import { transformLink } from '../../../services/prismic/transformers';

type PopupDialogOpenProps = {
  isActive: boolean;
  shouldStartAnimation: boolean;
};
const PopupDialogOpen = styled(Space).attrs<PopupDialogOpenProps>(props => ({
  'aria-hidden': props.isActive ? 'true' : 'false',
  'aria-controls': 'user-initiated-dialog-window',
  tabIndex: props.isActive ? '-1' : '0',
  as: 'button',
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
    overrides: { small: 4, medium: 4, large: 4 },
  },
  h: {
    size: 'm',
    properties: ['padding-left', 'padding-right'],
    overrides: { small: 5, medium: 5, large: 5 },
  },
  className:
    font('intb', 5) +
    ' ' +
    'plain-button line-height-1 flex-inline flex--v-center',
}))<PopupDialogOpenProps>`
  color: ${props => props.theme.color('purple')};
  position: fixed;
  transform: ${props =>
    props.isActive || !props.shouldStartAnimation
      ? 'translateY(10px)'
      : 'translateY(0px)'};
  bottom: 20px;
  left: 20px;
  z-index: 3;
  background: ${props => props.theme.color('white')};
  opacity: ${props => (props.isActive || !props.shouldStartAnimation ? 0 : 1)};
  transition: opacity 500ms ease, filter 500ms ease, transform 500ms ease;
  transition-delay: ${props => (props.isActive ? '0ms' : '500ms')};
  border-radius: 9999px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3);

  &:hover,
  &:focus {
    outline: 0;
    border: 0;
    color: ${props => props.theme.color('white')};
    background: ${props => props.theme.color('purple')};

    .icon__shape {
      fill: ${props => props.theme.color('white')};
    }
  }
`;

type PopupDialogWindowProps = {
  isActive: boolean;
};
const PopupDialogWindow = styled(Space).attrs({
  'aria-modal': true,
  id: 'user-initiated-dialog-window',
  v: {
    size: 'l',
    properties: ['padding-top', 'padding-bottom'],
    overrides: { small: 6, medium: 6, large: 6 },
  },
  h: {
    size: 'l',
    properties: ['padding-left', 'padding-right'],
    overrides: { small: 6, medium: 6, large: 6 },
  },
  className: 'font-purple',
})<PopupDialogWindowProps>`
  background-color: ${props => props.theme.color('white')};
  border-radius: 20px 0 20px 0;
  box-shadow: 0 2px 60px 0 rgba(0, 0, 0, 0.7);
  opacity: ${props => (props.isActive ? 1 : 0)};
  pointer-events: ${props => (props.isActive ? 'all' : 'none')};
  transform: ${props =>
    props.isActive ? 'translateY(0px)' : 'translateY(10px)'};
  transition: opacity 500ms ease, transform 500ms ease;
  transition-delay: ${props => (props.isActive ? '500ms' : '0ms')};
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  max-width: 370px;
  z-index: 3;
`;

const PopupDialogClose = styled.button.attrs({
  className:
    'absolute plain-button no-margin no-padding flex flex--v-center flex--h-center',
})<{ isKeyboard: boolean }>`
  top: 10px;
  right: 10px;

  &:focus {
    outline: 0;

    ${props =>
      props.isKeyboard &&
      `
      box-shadow: ${props.theme.focusBoxShadow};
    `}
  }
`;

const PopupDialogCTA = styled(Space).attrs({
  as: 'a',
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
    overrides: { small: 3, medium: 3, large: 3 },
  },
  h: {
    size: 'm',
    properties: ['padding-left', 'padding-right'],
    overrides: { small: 5, medium: 5, large: 5 },
  },
  className: `${font('intb', 5, {
    small: 3,
    medium: 3,
  })} rounded-corners inline-block`,
})`
  background-color: ${props => props.theme.color('purple')};
  color: ${props => props.theme.color('white')};
  transition: all 500ms ease;
  border: 2px solid transparent;
  text-decoration: none;

  &:hover,
  &:focus {
    outline: 0;
    color: ${props => props.theme.color('purple')};
    border-color: ${props => props.theme.color('purple')};
    background: ${props => props.theme.color('white')};
  }
`;

type Props = {
  document: { data: InferDataInterface<PopupDialogPrismicDocument> };
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
  const { isKeyboard } = useContext(AppContext);

  function hidePopupDialog() {
    cookie.set('WC_PopupDialog', 'true', {
      path: '/',
      expires: null,
    });

    setShouldRender(false);
  }

  useEffect(() => {
    setShouldRender(!cookie.get('WC_PopupDialog'));

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

    if (
      dialog &&
      isActiveRef.current &&
      !dialog.contains(event.target as HTMLDivElement)
    ) {
      setIsActive(false);
      openDialogRef && openDialogRef.current && openDialogRef.current.focus();
      trackEvent({
        category: 'PopupDialog',
        action: 'close dialog',
      });
    }
  }

  function handleEscapeKeyDown(event: KeyboardEvent) {
    if (event.keyCode === 27 && isActiveRef.current) {
      setIsActive(false);
      openDialogRef && openDialogRef.current && openDialogRef.current.focus();
      trackEvent({
        category: 'PopupDialog',
        action: 'close dialog',
      });
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
        isActive={isActive}
        shouldStartAnimation={shouldStartAnimation}
        onClick={() => {
          setIsActive(true);
          setFocusable(true);
          closeDialogRef &&
            closeDialogRef.current &&
            closeDialogRef.current.focus();

          trackEvent({
            category: 'PopupDialog',
            action: 'open dialog',
          });
        }}
      >
        <Space
          h={{
            size: 's',
            properties: ['margin-right'],
            overrides: { medium: 2, large: 2 },
          }}
        >
          <Icon icon={chat} color="purple" />
        </Space>
        {openButtonText}
      </PopupDialogOpen>
      <PopupDialogWindow ref={dialogWindowRef} isActive={isActive}>
        <PopupDialogClose
          isKeyboard={isKeyboard}
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

            trackEvent({
              category: 'PopupDialog',
              action: 'close dialog',
            });
          }}
        >
          <Icon icon={clear} title="Close dialog" color="purple" />
        </PopupDialogClose>
        <Space
          h={{
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
