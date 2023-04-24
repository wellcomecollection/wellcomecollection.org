import { ForwardedRef, forwardRef, ForwardRefRenderFunction } from 'react';
import styled from 'styled-components';
import Space from '../styled/Space';

const StyledInput = styled.input`
  outline: none;
  border: 1px solid ${props => props.theme.color('warmNeutral.400')};
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

const Input: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  { label, ...inputProps }: Props,
  ref: ForwardedRef<HTMLInputElement>
) => (
  <label>
    <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
      {label}
    </Space>
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    {/* @types/react has some issues currently with react refs */}
    <StyledInput type="number" ref={ref as any} {...inputProps} />
  </label>
);

const NumberInput = forwardRef<HTMLInputElement, Props>(Input);

export default NumberInput;
