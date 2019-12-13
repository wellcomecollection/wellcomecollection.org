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
  className: classNames({
    'btn line-height-1': true,
  }),
})`
  background: ${props =>
    props.isActive ? props.theme.colors.black : props.theme.colors.cream};
  color: ${props =>
    props.isActive ? props.theme.colors.white : props.theme.colors.black};

  &:hover,
  &:focus {
    background: ${props => props.theme.colors.black};
    color: ${props => props.theme.colors.white};
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
  z-index: 1;
  overflow: auto;

  &.fade-enter,
  &.fade-exit-active {
    opacity: 0;
    transform: translateY(5px);
  }

  &.fade-enter-active,
  &.fade-exit-active {
    transition: all 350ms ease-in-out;
  }

  &.fade-enter-active {
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
    if (isActive) {
      const focusables =
        dropdownElRef &&
        dropdownElRef.current &&
        getFocusableElementsIn(dropdownElRef.current);
      const firstFocusable = focusables && focusables[0];

      firstFocusable && firstFocusable.focus();
    }
  }, [isActive]);

  return (
    <DropdownWrapper ref={dropdownWrapperRef}>
      <ButtonEl isActive={isActive} onClick={() => setIsActive(!isActive)}>
        <span className={font('hnm', 5)}>{buttonText}</span>
        <Icon name="chevron" extraClasses={`${isActive ? 'icon--180' : ''}`} />
      </ButtonEl>
      <CSSTransition
        in={isActive}
        classNames="fade"
        timeout={350}
        unmountOnExit
      >
        <DropdownEl ref={dropdownElRef}>{children}</DropdownEl>
      </CSSTransition>
    </DropdownWrapper>
  );
};

export default DropdownButton;
