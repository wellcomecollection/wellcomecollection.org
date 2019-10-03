// @flow
import styled from 'styled-components';
import Space from '../styled/Space';
import { classNames, font } from '../../../utils/classnames';

const StyledSelect = styled.div.attrs(props => ({
  className: classNames({
    [font('hnl', 5)]: true,
  }),
}))`
  position: relative;
  &:after {
    position: absolute;
    margin-left: -22px;
    top: 17px;
    content: '';
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid ${props => props.theme.colors.silver};
  }
  select {
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    padding: 10px 26px 10px 12px;
    border: 1px solid ${props => props.theme.colors.pumice};
    border-radius: ${props => props.borderRadiusUnit}px;
    background-color: #fff;

    &::-ms-expand {
      display: none;
    }
    &:hover {
      border-color: ${props => props.theme.colors.yellow};
    }
    &:focus {
      padding: 9px 25px 9px 11px;
      border-width: 2px;
      border-color: ${props => props.theme.colors.yellow};
      outline: none;
    }
  }
`;

type Props = {
  label: string,
  defaultValue: ?string,
  options: {
    value: ?string,
    text: string,
  }[],
  onChange: any, // TODO
};

const SelectInput = ({ label, options, defaultValue, onChange }: Props) => {
  return (
    <StyledSelect>
      <label>
        <Space as="span" h={{ size: 's', properties: ['margin-right'] }}>
          {label}
        </Space>
        <select name="sortOrder" onChange={onChange} value={defaultValue}>
          {options.map(option => {
            return (
              <option key={option.text} value={option.value}>
                {option.text}
              </option>
            );
          })}
        </select>
      </label>
    </StyledSelect>
  );
};

export default SelectInput;

// TODOs
// correct position in the DOM
// styling
