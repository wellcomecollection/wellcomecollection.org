import { FocusTrap } from 'focus-trap-react';
import {
  FunctionComponent,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled, { useTheme } from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { chevron, IconSvg } from '@weco/common/icons';
import getFocusableElements from '@weco/common/utils/get-focusable-elements';
import { BorderlessButton } from '@weco/common/views/components/BorderlessClickable';
import Button, { ButtonTypes } from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';

const Anchor = styled.span`
  anchor-name: --dropdown-button;
`;

const DropdownWrapper = styled.div`
  anchor-scope: --dropdown-button;
  display: inline-flex;
  position: relative;
`;

const Dropdown = styled(Space).attrs<{
  $isTight: boolean;
  $isActive: boolean;
}>(props => ({
  $v: {
    size: props.$isTight ? 'xs' : 'sm',
    properties: ['padding-top', 'padding-bottom'],
  },
  $h: {
    size: props.$isTight ? 'sm' : 'md',
    properties: ['padding-left', 'padding-right'],
  },
}))<{
  $isActive: boolean;
  $isEnhanced: boolean;
}>`
  background-color: ${props => props.theme.color('white')};
  overflow: auto;
  white-space: nowrap;
  transition:
    opacity 350ms ease,
    transform 350ms ease;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  box-shadow: ${props => props.theme.basicBoxShadow};
  max-height: 40vh;
  z-index: 1;
  position: absolute;
  top: 100%;
  margin: 10px;

  @supports (position-anchor: --dropdown-button) {
    position-anchor: --dropdown-button;
    position: fixed;
    top: anchor(bottom);
    justify-self: anchor-center;
    position-try-fallbacks: --above;

    @position-try --above {
      top: auto;
      bottom: anchor(top);
    }
  }

  width: max-content;
  max-width: calc(100vw - 20px);
  opacity: ${props => (props.$isActive ? 1 : 0)};
  transform: ${props =>
    props.$isActive ? 'translateY(0)' : 'translateY(-10px)'};

  ${props => props.theme.media('md')`
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
  const theme = useTheme();
  const dropdownWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isActive, setIsActive] = useState(false);
  const [focusables, setFocusables] = useState<HTMLElement[]>([]);

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
          <Anchor>
            <Button
              variant="ButtonSolid"
              {...buttonProps}
              size="small"
              colors={
                isOnDark
                  ? theme.buttonColors.whiteTransparentWhite
                  : theme.buttonColors.marbleWhiteCharcoal
              }
            />
          </Anchor>
        )}
        {buttonType === 'outlined' && (
          <Anchor>
            <Button
              variant="ButtonSolid"
              {...buttonProps}
              colors={
                isOnDark
                  ? theme.buttonColors.whiteTransparentWhite
                  : theme.buttonColors.greenTransparentGreen
              }
            />
          </Anchor>
        )}
        {buttonType === 'borderless' && (
          <Anchor>
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
          </Anchor>
        )}
        {isEnhanced && (
          <Dropdown
            inert={!isActive}
            ref={dropdownRef}
            $isActive={isActive}
            $isEnhanced={isEnhanced}
            $isTight={!!isTight}
          >
            {children}
          </Dropdown>
        )}
        <noscript>
          <Dropdown
            ref={dropdownRef}
            $isActive={true}
            $isEnhanced={isEnhanced}
            $isTight={!!isTight}
          >
            {children}
          </Dropdown>
        </noscript>
      </DropdownWrapper>
    </FocusTrap>
  );
};

export default DropdownButton;
