import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import {
  BooleanFilter as BooleanFilterType,
  filterLabel,
} from '@weco/content/services/wellcome/catalogue/filters';
import { searchFilterCheckBox } from 'text/aria-labels';

type BooleanFilterProps = {
  f: BooleanFilterType;
  changeHandler: () => void;
  form?: string;
  hasNoOptions?: boolean;
};

export const BooleanFilter = ({
  f,
  changeHandler,
  form,
  hasNoOptions,
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
      disabled={hasNoOptions}
    />
  );
};
