// @flow
import { useState, useRef, useEffect, type Node } from 'react';
import styled from 'styled-components';
import cookie from 'cookie-cutter';
import { type Link } from '../../../model/link';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';
import { classNames, font } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';

const PopupDialogOpen = styled(Space).attrs(props => ({
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
  className: classNames({
    [font('hnm', 5)]: true,
    'plain-button line-height-1 flex-inline flex--v-center bg-hover-purple font-purple font-hover-white': true,
  }),
}))`
  position: fixed;
  transform: ${props =>
    props.isActive || !props.shouldStartAnimation
      ? 'translateY(10px)'
      : 'translateY(0px)'};
  bottom: 20px;
  left: 20px;
  z-index: 1;
  background: ${props => props.theme.colors.white};
  opacity: ${props => (props.isActive || !props.shouldStartAnimation ? 0 : 1)};
  transition: opacity 500ms ease, filter 500ms ease, transform 500ms ease;
  transition-delay: ${props => (props.isActive ? '0ms' : '500ms')};
  border-radius: 9999px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.3);

  &:hover,
  &:focus {
    outline: 0;
    border: 0;

    .icon__shape {
      fill: ${props => props.theme.colors.white};
    }
  }
`;

const PopupDialogWindow = styled(Space).attrs(props => ({
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
  className: classNames({
    'bg-white font-purple': true,
  }),
}))`
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
  z-index: 1;
`;

const PopupDialogClose = styled.button.attrs({
  className: classNames({
    'absolute plain-button no-margin no-padding flex flex--v-center flex--h-center': true,
  }),
})`
  top: 10px;
  right: 10px;
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
  className: classNames({
    [font('hnm', 5, { small: 3, medium: 3 })]: true,
    'bg-purple font-white font-hover-purple bg-hover-white rounded-corners inline-block': true,
  }),
})`
  transition: all 500ms ease;
  border: 2px solid transparent;
  text-decoration: none;

  &:hover,
  &:focus {
    outline: 0;
    border-color: ${props => props.theme.colors.purple};
  }
`;

type Props = {|
  openButtonText: string,
  children: Node,
  cta: Link,
|};

const PopupDialog = ({ children, openButtonText, cta }: Props) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const isActiveRef = useRef(isActive);
  const [shouldStartAnimation, setShouldStartAnimation] = useState(false);
  const openDialogRef = useRef(null);
  const closeDialogRef = useRef(null);
  const ctaRef = useRef(null);
  const dialogWindowRef = useRef(null);

  function hidePopupDialog() {
    cookie.set('WC_PopupDialog', 'true', {
      path: '/',
      expires: null,
    });

    setShouldRender(false);
  }

  useEffect(() => {
    setShouldRender(!cookie.get('WC_PopupDialog'));

    setTimeout(() => {
      setShouldStartAnimation(true);
    }, 2000);
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

  function handleBodyClick(event) {
    const dialog = dialogWindowRef && dialogWindowRef.current;

    if (dialog && isActiveRef.current && !dialog.contains(event.target)) {
      setIsActive(false);
      openDialogRef && openDialogRef.current && openDialogRef.current.focus();
      trackEvent({
        category: 'PopupDialog',
        action: 'close dialog',
      });
    }
  }

  function handleEscapeKeyDown(event) {
    if (event.keyCode === 27 && isActiveRef.current) {
      setIsActive(false);
      openDialogRef && openDialogRef.current && openDialogRef.current.focus();
      trackEvent({
        category: 'PopupDialog',
        action: 'close dialog',
      });
    }
  }

  function handleTrapStartKeyDown(event) {
    if (event.shiftKey && event.keyCode === 9) {
      event.preventDefault();
      ctaRef && ctaRef.current && ctaRef.current.focus();
    }
  }

  function handleTrapEndKeyDown(event) {
    if (!event.shiftKey && event.keyCode === 9) {
      event.preventDefault();
      closeDialogRef &&
        closeDialogRef.current &&
        closeDialogRef.current.focus();
    }
  }

  function setTabbable(value) {
    const dialog = dialogWindowRef && dialogWindowRef.current;
    const tababbles = dialog && [
      ...dialog.querySelectorAll('a'),
      ...dialog.querySelectorAll('button'),
    ];

    tababbles &&
      tababbles.forEach(item =>
        item.setAttribute('tabindex', value ? '0' : '-1')
      );
  }

  return (
    shouldRender && (
      <>
        <PopupDialogOpen
          title="open dialog"
          ref={openDialogRef}
          isActive={isActive}
          shouldStartAnimation={shouldStartAnimation}
          onClick={() => {
            setIsActive(true);
            setTabbable(true);
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
            <Icon name="chat" extraClasses="icon--purple" />
          </Space>
          {openButtonText}
        </PopupDialogOpen>
        <PopupDialogWindow ref={dialogWindowRef} isActive={isActive}>
          <PopupDialogClose
            title="close dialog"
            ref={closeDialogRef}
            onKeyDown={handleTrapStartKeyDown}
            onClick={() => {
              setIsActive(false);
              setTabbable(false);
              openDialogRef &&
                openDialogRef.current &&
                openDialogRef.current.focus();

              trackEvent({
                category: 'PopupDialog',
                action: 'close dialog',
              });
            }}
          >
            <Icon
              name="clear"
              title="Close dialog"
              extraClasses="icon--purple"
            />
          </PopupDialogClose>
          {children}
          <PopupDialogCTA
            href={cta.url}
            ref={ctaRef}
            onKeyDown={handleTrapEndKeyDown}
            onClick={hidePopupDialog}
          >
            {cta.text}
          </PopupDialogCTA>
        </PopupDialogWindow>
      </>
    )
  );
};

export default PopupDialog;
