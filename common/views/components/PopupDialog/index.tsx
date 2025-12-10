import { hasCookie, setCookie } from 'cookies-next';
import {
  FunctionComponent,
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';

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

import {
  PopupDialogClose,
  PopupDialogCTA,
  PopupDialogOpen,
  PopupDialogWindow,
} from './PopupDialog.styles';

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
    <div data-component="popup-dialog">
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
            size: 'xs',
            properties: ['margin-right'],
            overrides: { medium: '075', large: '075' },
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
            size: 'sm',
            properties: ['padding-right'],
            overrides: { small: '150', medium: '150', large: '150' },
          }}
        >
          <h2 className={font('brand', -2)}>{title}</h2>
          <div className={font('sans', -1)}>
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
    </div>
  ) : null;
};

export default PopupDialog;
