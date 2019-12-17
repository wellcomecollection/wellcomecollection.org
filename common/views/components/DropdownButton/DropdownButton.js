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

const ButtonEl = styled(Space).attrs({
  v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 's', properties: ['padding-left', 'padding-right'] },
  as: 'button',
  type: 'button',
  className: classNames({
    'btn line-height-1': true,
  }),
})`
  background: ${props =>
    props.isActive ? props.theme.colors.black : props.theme.colors.cream};
  color: ${props =>
    props.isActive ? props.theme.colors.white : props.theme.colors.black};

  border: ${props =>
    `2px solid ${
      props.isActive ? props.theme.colors.black : props.theme.colors.cream
    }`};

  &:hover,
  &:focus {
    background: ${props => props.theme.colors.black};
    color: ${props => props.theme.colors.white};
  }

  &:focus {
    outline: 0;
    border-color: ${props => props.theme.colors.yellow};
  }

  .icon {
    transition: transform 350ms ease;
  }
`;

const DropdownEl = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'absolute rounded-corners shadow bg-white': true,
  }),
})`
  top: 100%;
  left: -2px;
  margin-top: -2px;
  z-index: ${props => (props.isActive ? 1 : 0)};
  overflow: auto;
  white-space: nowrap;
  transition: all 350ms ease;

  &,
  &.fade-enter,
  &.fade-exit-active,
  &.fade-exit-done {
    opacity: 0;
    transform: translateY(5px);
  }

  &.fade-enter-active,
  &.fade-enter-done {
    opacity: 1;
    transform: translateY(0px);
  }
`;

type Props = {|
  buttonText: string,
  children: Element<any>,
|};

const DropdownButton = ({ buttonText, children }: Props) => {
  const [isActive, setIsActive] = useState(false);
  const dropdownWrapperRef = useRef(null);
  const dropdownElRef = useRef(null);

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
      dropdownElRef &&
      dropdownElRef.current &&
      getFocusableElementsIn(dropdownElRef.current);

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
      <ButtonEl isActive={isActive} onClick={() => setIsActive(!isActive)}>
        <span className={font('hnm', 5)}>{buttonText}</span>
        <Icon
          name="chevron"
          extraClasses={classNames({
            'icon--180': isActive,
          })}
        />
      </ButtonEl>
      <CSSTransition in={isActive} classNames="fade" timeout={350}>
        <DropdownEl isActive={isActive} ref={dropdownElRef}>
          {children}
        </DropdownEl>
      </CSSTransition>
    </DropdownWrapper>
  );
};

export default DropdownButton;
