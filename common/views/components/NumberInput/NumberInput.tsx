import { ForwardedRef, forwardRef } from 'react';
import styled from 'styled-components';
import Space from '../styled/Space';

const StyledInput = styled(Space).attrs({
  type: 'number',
})`
  outline: none;
  border: 1px solid ${props => props.theme.color('pumice')};
  padding: 12px;
  border-radius: 3px;
  appearance: none;

  /* removes up and down arrows webkit adds to number inputs on desktop */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:focus {
    border: 2px solid ${props => props.theme.color('black')};
    padding: 11px;
  }
`;

type Props = {
  label: string;
} & JSX.IntrinsicElements['input'];

const NumberInput = forwardRef(
  ({ label, ...inputProps }: Props, ref: ForwardedRef<HTMLInputElement>) => (
    <label>
      <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
        {label}
      </Space>

      <StyledInput as="input" type="number" ref={ref as any} {...inputProps} />
    </label>
  )
);

NumberInput.displayName = 'NumberInput';

export default NumberInput;
