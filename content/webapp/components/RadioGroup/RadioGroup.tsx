import React, { FunctionComponent } from 'react';
import styled from 'styled-components';

import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import Space from '@weco/common/views/components/styled/Space';

type WrapperProps = { isLast: boolean };

const CheckboxRadioWrapper = styled(Space).attrs<WrapperProps>(props => ({
  $v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
    overrides: { small: 3, medium: 3, large: 3 },
  },
  h: !props.isLast ? { size: 'm', properties: ['margin-right'] } : undefined,
}))<WrapperProps>`
  display: inline-flex;
  justify-content: center;
`;

type RadioGroupOption = {
  value: string;
  id: string;
  label: string;
};

type Props = {
  name: string;
  selected: string;
  onChange: (value: string) => void;
  options: RadioGroupOption[];
};

const RadioGroup: FunctionComponent<Props> = ({
  name,
  selected,
  onChange,
  options,
}) => (
  <div>
    {options.map(({ value, label, id }, index) => (
      <CheckboxRadioWrapper key={value} isLast={index === options.length - 1}>
        <CheckboxRadio
          id={id}
          text={label}
          type="radio"
          name={name}
          value={value}
          checked={selected === value}
          onChange={() => onChange(value)}
        />
      </CheckboxRadioWrapper>
    ))}
  </div>
);

export default RadioGroup;
