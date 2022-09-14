import React, { FunctionComponent } from 'react';

import CheckboxRadio from '../CheckboxRadio/CheckboxRadio';
import Space from '../styled/Space';

export type RadioGroupOption = {
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
}: Props) => (
  <div>
    {options.map(({ value, label, id }, index) => (
      <Space
        key={value}
        v={{
          size: 'm',
          properties: ['padding-top', 'padding-bottom'],
          overrides: { small: 3, medium: 3, large: 3 },
        }}
        h={
          index !== options.length - 1
            ? { size: 'm', properties: ['margin-right'] }
            : undefined
        }
        className="flex-inline flex--h-center"
      >
        <CheckboxRadio
          id={id}
          text={label}
          type="radio"
          name={name}
          value={value}
          checked={selected === value}
          onChange={() => onChange(value)}
        />
      </Space>
    ))}
  </div>
);

export default RadioGroup;
