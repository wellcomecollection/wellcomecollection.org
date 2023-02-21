import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import DateRangeFilter, {
  DateRangeFilterProps,
} from './SearchFilters.DateRangeFilter';

type DesktopDateRangeFilterProps = DateRangeFilterProps & {
  hasNoOptions?: boolean;
  isNewStyle?: boolean;
};

const DesktopDateRangeFilter = ({
  f,
  changeHandler,
  form,
  hasNoOptions,
  isNewStyle,
}: DesktopDateRangeFilterProps) => {
  return (
    <Space className={font('intr', 5)}>
      <DropdownButton
        isPill={isNewStyle}
        isFilter
        label={f.label}
        buttonType="inline"
        id={f.id}
        hasNoOptions={hasNoOptions}
      >
        <DateRangeFilter f={f} changeHandler={changeHandler} form={form} />
      </DropdownButton>
    </Space>
  );
};

export default DesktopDateRangeFilter;
