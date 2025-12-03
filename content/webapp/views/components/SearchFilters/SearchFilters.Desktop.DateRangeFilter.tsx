import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';

import DateRangeFilter, {
  DateRangeFilterProps,
} from './SearchFilters.DateRangeFilter';

type DesktopDateRangeFilterProps = DateRangeFilterProps & {
  hasNoOptions?: boolean;
};

const DesktopDateRangeFilter = ({
  f,
  changeHandler,
  form,
  hasNoOptions,
}: DesktopDateRangeFilterProps) => {
  return (
    <Space className={font('intr', -1)}>
      <Button
        variant="DropdownButton"
        isPill
        label={f.label}
        buttonType="inline"
        id={f.id}
        hasNoOptions={hasNoOptions}
      >
        <DateRangeFilter f={f} changeHandler={changeHandler} form={form} />
      </Button>
    </Space>
  );
};

export default DesktopDateRangeFilter;
