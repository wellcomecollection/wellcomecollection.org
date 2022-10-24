import { ChangeEvent, FunctionComponent } from 'react';
import SelectContainer from '../SelectContainer/SelectContainer';

export type SelectOption = {
  value?: string;
  text: string;
};

type Props = {
  name: string;
  label: string;
  value: string;
  hideLabel?: boolean;
  options: SelectOption[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
};

const Select: FunctionComponent<Props> = ({
  name,
  label,
  hideLabel,
  options,
  value,
  onChange,
}) => {
  return (
    <SelectContainer label={label} hideLabel={hideLabel}>
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
