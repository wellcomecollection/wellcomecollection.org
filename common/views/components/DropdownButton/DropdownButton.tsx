import { CSSTransition } from 'react-transition-group';
import { useState, useRef, useEffect } from 'react';
import { usePopper } from 'react-popper';
import styled from 'styled-components';
import { classNames } from '../../../utils/classnames';
import getFocusableElements from '../../../utils/get-focusable-elements';
import Space from '../styled/Space';
import ButtonInline, { ButtonTypes } from '../ButtonInline/ButtonInline';
import ButtonOulined from '../ButtonOutlined/ButtonOutlined';

const DropdownWrapper = styled.div.attrs({
  className: classNames({
    relative: true,
  }),
})``;

const Dropdown = styled(Space).attrs(props => ({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'rounded-corners shadow bg-white': true,
  }),
}))`
  margin-top: -2px;
  z-index: ${props => (props.isActive ? 2 : 1)};
  overflow: auto;
  white-space: nowrap;
  transition: opacity 350ms ease, transform 350ms ease;

  &,
  &.fade-exit-done {
    z-index: -1;
    pointer-events: none;
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

const Popper = styled.div`
  z-index: 1;
`;

type Props = {
  label: string;
  children: JSX.Element | JSX.Element[];
  isInline: boolean | null;
};

const DropdownButton = ({ label, children, isInline }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const dropdownWrapperRef = useRef(null);
  const dropdownRef = useRef(null);
  const popperRef = useRef(null);
  const { styles, attributes } = usePopper(
    dropdownWrapperRef.current,
    popperRef.current
  );

  const buttonProps = {
    isActive: isActive,
    clickHandler: () => setIsActive(!isActive),
    icon: 'chevron',
    text: label,
    type: ButtonTypes.button,
  };

  useEffect(() => {
    setIsEnhanced(true);
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        dropdownWrapperRef &&
        dropdownWrapperRef.current &&
        !dropdownWrapperRef.current.contains(event.target)
      ) {
        setIsActive(false);
      }
    }
    document.addEventListener('click', handleClick, false);

    return () => {
      document.removeEventListener('click', handleClick, false);
    };
  });

  useEffect(() => {
    const focusables =
      dropdownRef &&
      dropdownRef.current &&
      getFocusableElements(dropdownRef.current);

    if (isActive) {
      focusables &&
        focusables.forEach(focusable => focusable.removeAttribute('tabIndex'));
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
        <ButtonOulined {...buttonProps} />
      )}
      <Popper ref={popperRef} style={styles.popper} {...attributes.popper}>
        <CSSTransition in={isActive} classNames="fade" timeout={350}>
          <Dropdown
            isActive={isActive}
            isEnhanced={isEnhanced}
            ref={dropdownRef}
          >
            {children}
          </Dropdown>
        </CSSTransition>
      </Popper>
    </DropdownWrapper>
  );
};

export default DropdownButton;
