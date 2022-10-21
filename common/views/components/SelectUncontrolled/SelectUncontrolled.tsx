import { FunctionComponent } from 'react';
import SelectContainer from '../SelectContainer/SelectContainer';

type Props = {
  name: string;
  label: string;
  defaultValue: string;
  options: {
    value?: string;
    text: string;
  }[];
};

const SelectUncontrolled: FunctionComponent<Props> = ({
  name,
  label,
  options,
  defaultValue,
}: Props) => {
  return (
    <SelectContainer label={label}>
      <select name={name} defaultValue={defaultValue}>
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

export default SelectUncontrolled;
