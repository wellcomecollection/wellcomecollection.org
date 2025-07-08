import Button from '@weco/common/views/components/Buttons';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio';
import PlainList from '@weco/common/views/components/styled/PlainList';
import {
  CheckboxFilter as CheckboxFilterType,
  filterLabel,
} from '@weco/content/services/wellcome/common/filters';

type CheckboxFilterProps = {
  f: CheckboxFilterType;
  changeHandler: () => void;
  form?: string;
};

const CheckboxFilter = ({ f, changeHandler, form }: CheckboxFilterProps) => {
  return (
    <Button
      variant="DropdownButton"
      isPill
      label={f.label}
      buttonType="inline"
      id={f.id}
      hasNoOptions={f.options.length === 0}
      isTight
    >
      <PlainList>
        {f.options.map(({ id, label, value, count, selected }) => {
          return (
            <li key={id}>
              <CheckboxRadio
                id={id}
                type="checkbox"
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

export default CheckboxFilter;
