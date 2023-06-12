import { CSSTransition } from 'react-transition-group';
import {
  useState,
  useRef,
  useEffect,
  useContext,
  FunctionComponent,
  ReactNode,
  PropsWithChildren,
} from 'react';
import { usePopper } from 'react-popper';
import styled from 'styled-components';
import getFocusableElements from '@weco/common/utils/get-focusable-elements';
import Space from '../styled/Space';
import ButtonSolid, { ButtonTypes } from '../ButtonSolid/ButtonSolid';
import { BorderlessButton } from '../BorderlessClickable/BorderlessClickable';
import { AppContext } from '../AppContext/AppContext';
import { chevron, IconSvg } from '@weco/common/icons';
import { themeValues } from '@weco/common/views/themes/config';

const DropdownWrapper = styled.div`
  display: inline-flex;
  position: relative;
`;

type DropdownProps = {
  isActive: boolean;
  isEnhanced: boolean;
};
const Dropdown = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
})<DropdownProps>`
  background-color: ${props => props.theme.color('white')};
  margin-top: -2px;
  z-index: ${props => (props.isActive ? 2 : 1)};
  overflow: auto;
  white-space: nowrap;
  transition: opacity 350ms ease, transform 350ms ease;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  box-shadow: ${props => props.theme.basicBoxShadow};

  &,
  &.fade-exit-done {
    z-index: -1;
    pointer-events: ${props => (props.isEnhanced ? 'none' : 'all')};
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
    opacity: ${props => (props.isEnhanced ? 0 : 1)};
    transform: translateY(5px);
  }

  &.fade-enter-active,
  &.fade-enter-done {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Popper = styled.div<{ isVisible: boolean }>`
  width: max-content;
  height: ${props => (props.isVisible ? 'auto' : 0)};
  max-width: calc(100vw - 20px);
  z-index: ${props => (props.isVisible ? 1 : -1)};
  opacity: ${props => (props.isVisible ? 1 : 0)};

  ${props => props.theme.media('large')`
    max-width: calc(50vw - 20px);
  `}
`;

type Props = {
  id: string;
  label: ReactNode;
  ariaLabel?: string;
  buttonType?: 'outlined' | 'inline' | 'borderless';
  isOnDark?: boolean;
  iconLeft?: IconSvg;
  isPill?: boolean;
  hasNoOptions?: boolean;
};

const DropdownButton: FunctionComponent<PropsWithChildren<Props>> = ({
  label,
  ariaLabel,
  children,
  buttonType = 'outlined',
  isOnDark,
  id,
  iconLeft,
  isPill,
  hasNoOptions,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [focusables, setFocusables] = useState<HTMLElement[]>([]);
  const { isEnhanced } = useContext(AppContext);
  const dropdownWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const popperRef = useRef(null);
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
    if (dropdownRef && dropdownRef.current) {
      const focusableElements = getFocusableElements(
        dropdownRef.current
      ) as HTMLElement[];
      setFocusables(focusableElements);
      focusableElements.forEach(focusable =>
        focusable.setAttribute('tabIndex', '-1')
      );
    }
  }, [children]);

  useEffect(() => {
    if (isActive) {
      focusables.forEach(focusable => focusable.setAttribute('tabIndex', '0'));
    } else {
      focusables.forEach(focusable => focusable.setAttribute('tabIndex', '-1'));
    }
  }, [isActive, children]);

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
    <DropdownWrapper ref={dropdownWrapperRef}>
      {buttonType === 'inline' && (
        <ButtonSolid
          {...buttonProps}
          size="small"
          hoverUnderline={true}
          colors={
            isOnDark
              ? themeValues.buttonColors.whiteTransparentWhite
              : themeValues.buttonColors.marbleWhiteCharcoal
          }
        />
      )}
      {buttonType === 'outlined' && (
        <ButtonSolid
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
          type="button"
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
          isVisible={isPopperVisible}
        >
          <CSSTransition
            in={isActive}
            classNames="fade"
            timeout={350}
            onEnter={() => setIsPopperVisible(true)}
            onExited={() => setIsPopperVisible(false)}
          >
            <Dropdown
              isActive={isActive}
              isEnhanced={isEnhanced}
              ref={dropdownRef}
            >
              {children}
            </Dropdown>
          </CSSTransition>
        </Popper>
      )}
      <noscript>
        <Popper id={id} ref={popperRef} isVisible={true}>
          <Dropdown
            isActive={isActive}
            isEnhanced={isEnhanced}
            ref={dropdownRef}
          >
            {children}
          </Dropdown>
        </Popper>
      </noscript>
    </DropdownWrapper>
  );
};

export default DropdownButton;
