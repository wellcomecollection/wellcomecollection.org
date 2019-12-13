import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';
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
  v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'absolute rounded-corners shadow bg-white': true,
  }),
})`
  top: 100%;
  left: -2px;
  margin-top: -2px;
  z-index: 1;
  max-width: 400px;
  max-height: 600px;
  overflow: auto;
  display: ${props => (props.isActive ? 'block' : 'none')};
`;

const DropdownButton = () => {
  const [isActive, setIsActive] = useState(false);
  const dropdownWrapperRef = useRef(null);

  useEffect(() => {
    function handleClick(event) {
      if (
        dropdownWrapperRef &&
        dropdownWrapperRef.current &&
        !dropdownWrapperRef.current.contains(event.target)
      ) {
        setIsActive(false);
      }
    }
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  });

  return (
    <DropdownWrapper ref={dropdownWrapperRef}>
      <ButtonEl isActive={isActive} onClick={() => setIsActive(!isActive)}>
        <span className={font('hnm', 5)}>Filters</span>
        <Icon name="chevron" extraClasses={`${isActive ? 'icon--180' : ''}`} />
      </ButtonEl>
      <DropdownEl isActive={isActive}>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt
          alias iusto, doloribus velit sequi in veniam numquam, error ipsa
          laborum id exercitationem. Quo aspernatur, ea saepe a et placeat
          magni.
        </p>
      </DropdownEl>
    </DropdownWrapper>
  );
};

export default DropdownButton;
