import CheckboxRadio from '@weco/common/views/components/CheckboxRadio';
import {
  BooleanFilter as BooleanFilterType,
  filterLabel,
} from '@weco/content/services/wellcome/common/filters';
import { searchFilterCheckBox } from '@weco/content/text/aria-labels';

type BooleanFilterProps = {
  f: BooleanFilterType;
  changeHandler: () => void;
  form?: string;
};

export const BooleanFilter = ({
  f,
  changeHandler,
  form,
}: BooleanFilterProps) => {
  return (
    <CheckboxRadio
      id={f.id}
      type="checkbox"
      text={filterLabel({ label: f.label, count: f.count })}
      value="true"
      name={f.id}
      checked={f.isSelected}
      onChange={changeHandler}
      ariaLabel={searchFilterCheckBox(f.label)}
      form={form}
      disabled={f.count === 0 && !f.isSelected}
    />
  );
};
