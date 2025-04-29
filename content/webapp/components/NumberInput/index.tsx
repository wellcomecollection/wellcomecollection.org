import { ForwardedRef, forwardRef, ForwardRefRenderFunction, JSX } from 'react';
import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';

const StyledInput = styled.input`
  outline: none;
  border: 1px solid ${props => props.theme.color('warmNeutral.400')};
  padding: 12px;
  border-radius: 3px;
  appearance: none;

  /* removes up and down arrows webkit adds to number inputs on desktop */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    margin: 0;
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
    <Space as="span" $h={{ size: 'm', properties: ['margin-right'] }}>
      {label}
    </Space>
    {/* @types/react has some issues currently with react refs */}
    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
    <StyledInput type="number" ref={ref as any} {...inputProps} />
  </label>
);

const NumberInput = forwardRef<HTMLInputElement, Props>(Input);

export default NumberInput;
