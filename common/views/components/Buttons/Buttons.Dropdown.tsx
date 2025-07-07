import { FocusTrap } from 'focus-trap-react';
import {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { usePopper } from 'react-popper';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { chevron, IconSvg } from '@weco/common/icons';
import getFocusableElements from '@weco/common/utils/get-focusable-elements';
import { BorderlessButton } from '@weco/common/views/components/BorderlessClickable';
import Button, { ButtonTypes } from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';
import { themeValues } from '@weco/common/views/themes/config';

const DropdownWrapper = styled.div`
  display: inline-flex;
  position: relative;
`;

const Dropdown = styled(Space).attrs<{ $isTight: boolean }>(props => ({
  $v: {
    size: props.$isTight ? 's' : 'm',
    properties: ['padding-top', 'padding-bottom'],
  },
  $h: {
    size: props.$isTight ? 'm' : 'l',
    properties: ['padding-left', 'padding-right'],
  },
}))<{
  $isActive: boolean;
  $isEnhanced: boolean;
}>`
  background-color: ${props => props.theme.color('white')};
  margin-top: -2px;
  z-index: ${props => (props.$isActive ? 2 : 1)};
  overflow: auto;
  white-space: nowrap;
  transition:
    opacity 350ms ease,
    transform 350ms ease;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  box-shadow: ${props => props.theme.basicBoxShadow};
  max-height: 40vh;

  &,
  &.fade-exit-done {
    z-index: -1;
    pointer-events: ${props => (props.$isEnhanced ? 'none' : 'all')};
  }

  &.fade-enter,
  &.fade-exit,
  &.fade-enter-done {
    z-index: 2;
    pointer-events: all;
  }

  &,
  &.fade-enter,
  &.fade-exit-active,
  &.fade-exit-done {
    opacity: ${props => (props.$isEnhanced ? 0 : 1)};
    transform: translateY(5px);
  }

  &.fade-enter-active,
  &.fade-enter-done {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Popper = styled.div<{ $isVisible: boolean }>`
  width: max-content;
  height: ${props => (props.$isVisible ? 'auto' : 0)};
  max-width: calc(100vw - 20px);
  z-index: ${props => (props.$isVisible ? 1 : -1)};
  opacity: ${props => (props.$isVisible ? 1 : 0)};

  ${props => props.theme.media('large')`
    max-width: calc(50vw - 20px);
  `}
`;

export type DropdownButtonProps = {
  id: string;
  label: ReactNode;
  ariaLabel?: string;
  buttonType?: 'outlined' | 'inline' | 'borderless';
  isOnDark?: boolean;
  iconLeft?: IconSvg;
  isPill?: boolean;
  hasNoOptions?: boolean;
  isTight?: boolean;
};

const DropdownButton: FunctionComponent<
  PropsWithChildren<DropdownButtonProps>
> = ({
  label,
  ariaLabel,
  children,
  buttonType = 'outlined',
  isOnDark,
  id,
  iconLeft,
  isPill,
  hasNoOptions,
  isTight,
}) => {
  const { isEnhanced } = useAppContext();
  const dropdownWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const popperRef = useRef(null);

  const [isActive, setIsActive] = useState(false);
  const [focusables, setFocusables] = useState<HTMLElement[]>([]);
  const [isPopperVisible, setIsPopperVisible] = useState(false);
  const { styles, attributes } = usePopper(
    dropdownWrapperRef.current,
    popperRef.current,
    {
      modifiers: [
        {
          name: 'preventOverflow',
          options: {
            padding: 10,
          },
        },
      ],
    }
  );

  useEffect(() => {
    function hideDropdownOnDocClick(event: MouseEvent) {
      if (
        dropdownWrapperRef &&
        dropdownWrapperRef.current &&
        !dropdownWrapperRef.current.contains(event.target as HTMLDivElement)
      ) {
        setIsActive(false);
      }
    }
    document.addEventListener('click', hideDropdownOnDocClick, false);

    return () => {
      document.removeEventListener('click', hideDropdownOnDocClick, false);
    };
  });

  useEffect(() => {
    dropdownRef &&
      dropdownRef.current &&
      setFocusables(getFocusableElements(dropdownRef.current, true));
  }, [children]);

  useEffect(() => {
    if (isActive) {
      focusables.forEach(focusable => focusable.setAttribute('tabIndex', '0'));
    } else {
      focusables.forEach(focusable => focusable.setAttribute('tabIndex', '-1'));
    }
  }, [isActive, focusables]);

  const buttonProps = {
    isActive,
    clickHandler: () => setIsActive(!isActive),
    icon: chevron,
    isIconAfter: true,
    text: label,
    ariaLabel,
    type: ButtonTypes.button,
    ariaControls: id,
    ariaExpanded: isActive,
    isPill,
    disabled: hasNoOptions,
  };

  return (
    <FocusTrap
      active={isActive}
      focusTrapOptions={{ preventScroll: false, clickOutsideDeactivates: true }}
    >
      <DropdownWrapper ref={dropdownWrapperRef}>
        {buttonType === 'inline' && (
          <Button
            variant="ButtonSolid"
            {...buttonProps}
            size="small"
            colors={
              isOnDark
                ? themeValues.buttonColors.whiteTransparentWhite
                : themeValues.buttonColors.marbleWhiteCharcoal
            }
          />
        )}
        {buttonType === 'outlined' && (
          <Button
            variant="ButtonSolid"
            {...buttonProps}
            colors={
              isOnDark
                ? themeValues.buttonColors.whiteTransparentWhite
                : themeValues.buttonColors.greenTransparentGreen
            }
          />
        )}
        {buttonType === 'borderless' && (
          <BorderlessButton
            aria-controls={id}
            aria-expanded={isActive}
            isActive={isActive}
            clickHandler={() => setIsActive(!isActive)}
            icon={chevron}
            iconLeft={iconLeft}
            text={label}
            aria-label={ariaLabel}
          />
        )}
        {isEnhanced && (
          <Popper
            id={id}
            ref={popperRef}
            style={styles.popper}
            {...(isEnhanced ? attributes.popper : {})}
            $isVisible={isPopperVisible}
          >
            <CSSTransition
              nodeRef={dropdownRef}
              in={isActive}
              classNames="fade"
              timeout={350}
              onEnter={() => setIsPopperVisible(true)}
              onExited={() => setIsPopperVisible(false)}
            >
              <Dropdown
                ref={dropdownRef}
                $isActive={isActive}
                $isEnhanced={isEnhanced}
                $isTight={!!isTight}
              >
                {children}
              </Dropdown>
            </CSSTransition>
          </Popper>
        )}
        <noscript>
          <Popper id={id} ref={popperRef} $isVisible={true}>
            <Dropdown
              ref={dropdownRef}
              $isActive={isActive}
              $isEnhanced={isEnhanced}
              $isTight={!!isTight}
            >
              {children}
            </Dropdown>
          </Popper>
        </noscript>
      </DropdownWrapper>
    </FocusTrap>
  );
};

export default DropdownButton;
