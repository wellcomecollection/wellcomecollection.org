import { ForwardedRef, forwardRef, ForwardRefRenderFunction, JSX } from 'react';
import styled from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import { DateRangeFilter as DateRangeFilterType } from '@weco/content/services/wellcome/common/filters';
import { useControlledState } from '@weco/content/utils/useControlledState';

export const dateRegex = /^\d{4}$|^$/;

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

export type DateRangeFilterProps = {
  f: DateRangeFilterType;
  changeHandler: () => void;
  form?: string;
};

const DateRangeFilter = ({ f, changeHandler, form }: DateRangeFilterProps) => {
  const [from, setFrom] = useControlledState(f.from.value);
  const [to, setTo] = useControlledState(f.to.value);

  return (
    <>
      <Space as="span" $h={{ size: 'm', properties: ['margin-right'] }}>
        <NumberInput
          name={f.from.id}
          label="From"
          min="0"
          max="9999"
          placeholder="Year"
          value={from || ''}
          onChange={event => {
            const val = `${event.currentTarget.value}`;
            setFrom(val);
            if (val.match(dateRegex)) {
              changeHandler();
            }
          }}
          form={form}
        />
      </Space>
      <NumberInput
        name={f.to.id}
        label="to"
        min="0"
        max="9999"
        placeholder="Year"
        value={to || ''}
        onChange={event => {
          const val = `${event.currentTarget.value}`;
          setTo(val);
          if (val.match(dateRegex)) {
            changeHandler();
          }
        }}
        form={form}
      />
    </>
  );
};

export default DateRangeFilter;
