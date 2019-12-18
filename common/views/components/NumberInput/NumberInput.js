// @flow
import { forwardRef, type ComponentType } from 'react';
import styled from 'styled-components';
import Space, { type SpaceComponentProps } from '../styled/Space';

const StyledInput: ComponentType<SpaceComponentProps> = styled(Space).attrs({
  type: 'number',
})`
  outline: none;
  border: 1px solid ${props => props.theme.colors.pumice};
  padding: 12px;
  border-radius: 3px;

  /* removes up and down arrows webkit adds to number inputs on desktop */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    border: 2px solid ${props => props.theme.colors.black};
    padding: 11px;
  }
`;

type Props = {
  label: string,
  // We can also pass inputProps here
};

// $FlowFixMe (forwardRef)
const NumberInput = forwardRef((
  { label, ...inputProps }: Props,
  ref // eslint-disable-line
) => (
  <label>
    <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
      {label}
    </Space>
    <StyledInput as="input" ref={ref} {...inputProps} />
  </label>
));
export default NumberInput;
