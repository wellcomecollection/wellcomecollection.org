// @flow
import { CSSTransition } from 'react-transition-group';
import { useState, useRef, useEffect, type Element } from 'react';
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';
import getFocusableElementsIn from '../../../utils/get-focusable-elements-in';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';

const DropdownWrapper = styled.div.attrs({
  className: classNames({
    relative: true,
  }),
})``;

const Button = styled(Space).attrs(props => ({
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 's', properties: ['padding-left', 'padding-right'] },
  as: props.isEnhanced ? 'button' : 'span',
  type: props.isEnhanced ? 'button' : undefined,
  className: classNames({
    'line-height-1': true,
    btn: props.isEnhanced,
  }),
}))`
  ${props =>
    props.isEnhanced &&
    `
  background: ${
    props.isActive ? props.theme.colors.black : props.theme.colors.cream
  };
  color: ${
    props.isActive ? props.theme.colors.white : props.theme.colors.black
  };

    &:hover,
    &:focus {
      background: ${props.theme.colors.black};
      color: ${props.theme.colors.white};
    }
  `}

  .icon {
    transition: transform 350ms ease;
  }
`;

const Dropdown = styled(Space).attrs(props => ({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'rounded-corners shadow bg-white': true,
    absolute: props.isEnhanced,
  }),
}))`
  top: 100%;
  left: -2px;
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

type Props = {|
  label: string,
  children: Element<any>,
|};

const DropdownButton = ({ label, children }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const dropdownWrapperRef = useRef(null);
  const dropdownRef = useRef(null);

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
      getFocusableElementsIn(dropdownRef.current);

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
      <Button
        isActive={isActive}
        isEnhanced={isEnhanced}
        onClick={() => setIsActive(!isActive)}
      >
        <span className={font('hnm', 5)}>{label}</span>
        <Icon
          name="chevron"
          extraClasses={classNames({
            'icon--180': isActive,
            'is-hidden': !isEnhanced,
          })}
        />
      </Button>
      <CSSTransition in={isActive} classNames="fade" timeout={350}>
        <Dropdown isActive={isActive} isEnhanced={isEnhanced} ref={dropdownRef}>
          {children}
        </Dropdown>
      </CSSTransition>
    </DropdownWrapper>
  );
};

export default DropdownButton;
