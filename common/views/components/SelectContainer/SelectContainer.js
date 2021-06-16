// @flow
import { useContext, type Element } from 'react';
// $FlowFixMe (tsx)
import { AppContext } from '../AppContext/AppContext';
import styled from 'styled-components';
// $FlowFixMe (tsx)
import Space from '../styled/Space';
// $FlowFixMe (tsx)
import Icon from '../Icon/Icon';
import { classNames, font } from '../../../utils/classnames';

const StyledSelect = styled.div.attrs(props => ({
  className: classNames({
    [font('hnr', 5)]: true,
  }),
}))`
  position: relative;

  .icon {
    pointer-events: none;
    top: 6px;
    right: 36px;
  }

  select {
    -moz-appearance: none;
    -webkit-appearance: none;
    font-family: inherit;
    font-weight: inherit;
    appearance: none;
    padding: 7px 36px 9px 12px;
    border: 2px solid ${props => props.theme.color('pumice')};
    border-radius: ${props => props.theme.borderRadiusUnit}px;
    background-color: ${props => props.theme.color('white')};

    &::-ms-expand {
      display: none;
    }

    &:hover {
      box-shadow: ${props => props.theme.focusBoxShadow};
    }

    &:focus {
      outline: 0;

      ${props =>
        props.isKeyboard &&
        `
        box-shadow: ${props.theme.focusBoxShadow};
      `}
    }
  }
`;

type Props = {
  label: string,
  children: Element<'select'>,
};

const SelectContainer = ({ label, children }: Props) => {
  const { isKeyboard } = useContext(AppContext);

  return (
    <StyledSelect isKeyboard={isKeyboard}>
      <label>
        <Space
          as="span"
          h={{ size: 'm', properties: ['margin-right'] }}
          className={classNames({
            [font('hnb', 5)]: true,
          })}
        >
          {label}
        </Space>
        {children}
      </label>
      <Icon name="chevron" />
    </StyledSelect>
  );
};

export default SelectContainer;
