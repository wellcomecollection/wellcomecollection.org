// @flow
import styled from 'styled-components';
import Space from '../styled/Space';
import { classNames /* font */ } from '../../../utils/classnames';

const StyledSelect = styled.div.attrs(props => ({
  className: classNames({
    // [font('hnl', 5)]: true,
  }),
}))`
  select {
    border: 1px solid red;
  }
`;

type Props = {
  label: string,
  options: {
    selected: boolean,
    value: ?string,
    text: string,
  }[],
  // We can also pass inputProps here
};

const SelectInput = ({ label, options }: Props) => {
  return (
    <StyledSelect>
      <label>
        <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
          {label}
        </Space>
        <select name="sortOrder">
          {options.map(option => {
            return (
              <option
                key={option.text}
                value={option.value}
                selected={option.selected}
              >
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
// styling
