// @flow
import React from 'react';
import styled from 'styled-components';
import { font } from '../../../utils/classnames';

type Props<T: { toString: () => void }> = {|
  name: string,
  selected: ?T,
  onChange: (value: T) => void,
  options: Array<{|
    value: T,
    label: string,
  |}>,
  className?: string,
|};

const Wrapper = styled.div``;

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
  width: 24px;
  height: 24px;
  border: 2px solid ${({ theme }) => theme.colors.pumice};

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
    // This scale needs to be here because the width/height should be 14px
    // However, when it's an even number, a bug in Chrome's subpixel rendering means that
    // the element does not display as a perfect circle.
    transform: translate(-50%, -50%) scale(1.077);
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.teal};
  }
`;

const Label = styled.label`
  color: ${({ theme, active }) =>
    active ? theme.colors.black : theme.colors.pewter};
  margin-left: 6px;
`;

const RadioGroup = <T>({
  name,
  selected,
  onChange,
  options,
  className,
}: Props<T>) => (
  <Wrapper className={className}>
    {options.map(({ value, label }) => (
      <FieldWrapper key={value.toString()}>
        <RadioInput
          id={value}
          name={name}
          value={value}
          checked={selected === value}
          onChange={() => onChange(value)}
        />
        <Label
          className={font('hnl', 5)}
          for={value}
          active={selected === value}
        >
          {label}
        </Label>
      </FieldWrapper>
    ))}
  </Wrapper>
);

export default RadioGroup;
