import { CSSTransition } from 'react-transition-group';
import {
  useState,
  useRef,
  useEffect,
  useContext,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';
import { usePopper } from 'react-popper';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import getFocusableElements from '../../../utils/get-focusable-elements';
import Space from '../styled/Space';
import { ButtonTypes } from '../ButtonSolid/ButtonSolid';
import ButtonInline from '../ButtonInline/ButtonInline';
import ButtonOutlined from '../ButtonOutlined/ButtonOutlined';
import { AppContext } from '../AppContext/AppContext';

const DropdownWrapper = styled.div.attrs({
  className: classNames({
    'flex-inline relative': true,
  }),
})``;

type DropdownProps = {
  isActive: boolean;
  isEnhanced: boolean;
};
const Dropdown = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'rounded-corners shadow bg-white': true,
  }),
})<DropdownProps>`
  margin-top: -2px;
  z-index: ${props => (props.isActive ? 2 : 1)};
  overflow: auto;
  white-space: nowrap;
  transition: opacity 350ms ease, transform 350ms ease;

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
    transform: translateY(0px);
  }
`;

const Popper = styled('div')<{ isVisible: boolean }>`
  width: max-content;
  height: ${props => (props.isVisible ? 'auto' : 0)};
  max-width: calc(100vw - 20px);
  z-index: ${props => (props.isVisible ? 1 : -1)};
  opacity: ${props => (props.isVisible ? 1 : 0)};
`;

type Props = {
  label: string;
  children: ReactNode;
  isInline: boolean | null;
  isOnDark?: boolean;
  id: string;
};

const DropdownButton: FunctionComponent<Props> = ({
  label,
  children,
  isInline,
  isOnDark,
  id,
}: Props): ReactElement<Props> => {
  const [isActive, setIsActive] = useState(false);
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

  const buttonProps = {
    isActive: isActive,
    clickHandler: () => setIsActive(!isActive),
    icon: 'chevron',
    text: label,
    type: ButtonTypes.button,
    isOnDark: isOnDark,
    ariaControls: id,
    ariaExpanded: isActive,
  };

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
    const focusables =
      dropdownRef &&
      dropdownRef.current &&
      getFocusableElements(dropdownRef.current);

    if (isActive) {
      focusables &&
        focusables.forEach(focusable => focusable.setAttribute('tabIndex', '0'));
      const firstFocusable = focusables && focusables[0];

      firstFocusable && firstFocusable.focus();
    } else {
      focusables &&
        focusables.forEach(focusable =>
          focusable.setAttribute('tabIndex', '-1')
        );
    }
  }, [isActive]);

  return (
    <DropdownWrapper ref={dropdownWrapperRef}>
      {isInline ? (
        <ButtonInline {...buttonProps} />
      ) : (
        <ButtonOutlined {...buttonProps} />
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
