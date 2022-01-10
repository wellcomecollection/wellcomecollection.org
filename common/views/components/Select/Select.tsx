import { ChangeEvent } from 'react';
import SelectContainer from '../SelectContainer/SelectContainer';

type Props = {
  name: string;
  label: string;
  value: string;
  options: {
    value?: string;
    text: string;
  }[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

const Select = ({ name, label, options, value, onChange }: Props) => {
  return (
    <SelectContainer label={label}>
      <select name={name} onChange={onChange} value={value}>
        {options.map(option => {
          return (
            <option key={option.text} value={option.value}>
              {option.text}
            </option>
          );
        })}
      </select>
    </SelectContainer>
  );
};

export default Select;
