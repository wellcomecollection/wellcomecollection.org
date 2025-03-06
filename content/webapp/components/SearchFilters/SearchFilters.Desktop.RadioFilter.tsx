import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import PlainList from '@weco/common/views/components/styled/PlainList';
import {
  filterLabel,
  RadioFilter as RadioFilterType,
} from '@weco/content/services/wellcome/common/filters';

type RadioFilterProps = {
  f: RadioFilterType;
  changeHandler: () => void;
  form?: string;
};

const RadioFilter = ({ f, changeHandler, form }: RadioFilterProps) => {
  return (
    <Button
      variant="DropdownButton"
      isPill
      label={f.label}
      buttonType="inline"
      id={f.id}
      hasNoOptions={f.options.length === 0}
    >
      <PlainList className={font('intr', 5)}>
        {f.options.map(({ id, label, value, count, selected }) => {
          return (
            <li key={id}>
              <CheckboxRadio
                id={id}
                type="radio"
                text={filterLabel({ label, count })}
                value={value}
                name={f.id}
                checked={selected}
                onChange={changeHandler}
                form={form}
              />
            </li>
          );
        })}
      </PlainList>
    </Button>
  );
};

export default RadioFilter;
