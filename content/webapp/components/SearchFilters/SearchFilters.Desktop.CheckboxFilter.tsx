import {
  CheckboxFilter as CheckboxFilterType,
  filterLabel,
} from '@weco/content/services/wellcome/catalogue/filters';

import PlainList from '@weco/common/views/components/styled/PlainList';
import CheckboxRadio from '@weco/common/views/components/CheckboxRadio/CheckboxRadio';
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import { font } from '@weco/common/utils/classnames';

type CheckboxFilterProps = {
  f: CheckboxFilterType;
  changeHandler: () => void;
  form?: string;
};

const CheckboxFilter = ({ f, changeHandler, form }: CheckboxFilterProps) => {
  return (
    <DropdownButton
      isPill
      label={f.label}
      buttonType="inline"
      id={f.id}
      hasNoOptions={f.options.length === 0}
    >
      <PlainList className={font('intr', 5)}>
        {f.options.map(({ id, label, value, count, selected }, i) => {
          return (
            // TODO remove index from key once we resolve the doubled IDs issue
            // (https://github.com/wellcomecollection/wellcomecollection.org/issues/9109)
            // as we now sometimes get "Warning: Encountered two children with the same key" console errors
            <li key={`${id}-${i}`}>
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
    </DropdownButton>
  );
};

export default CheckboxFilter;
