// @flow
import React from 'react';
import styled from 'styled-components';
import { font } from '../../../utils/classnames';

type Props<T> = {|
  name: string,
  selected: ?T,
  onChange: (value: T) => void,
  options: Array<{|
    value: T,
    label: string,
  |}>,
  className?: string,
|};

const FieldWrapper = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px;
  font-size: 50px;

  &:not:last-of-type {
    margin-right: 12px;
  }
`;

const RadioInput = styled.input.attrs({ type: 'radio' })`
  appearance: none;
  display: inline-block;
  position: relative;
  border-radius: 50%;
  width: 23px;
  height: 23px;
  border: 2px solid ${({ theme }) => theme.colors.pumice};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.pewter};
  }

  &:checked::before {
    content: ' ';
    display: inline-block;
    position: absolute;
    width: 13px;
    height: 13px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.green};
  }
`;

const Label = styled.label`
  color: ${({ theme, active }) =>
    active ? theme.colors.black : theme.colors.pewter};
  margin-left: 6px;
  cursor: pointer;
`;

const RadioGroup = <+T>({
  name,
  selected,
  onChange,
  options,
  className,
}: Props<T>) => (
  <div className={className}>
    {options.map(({ value, label }) => (
      <FieldWrapper key={String(value)}>
        <RadioInput
          id={value}
          name={name}
          value={value}
          checked={selected === value}
          onChange={() => onChange(value)}
        />
        <Label
          className={font('hnl', 5)}
          htmlFor={value}
          active={selected === value}
        >
          {label}
        </Label>
      </FieldWrapper>
    ))}
  </div>
);

export default RadioGroup;
