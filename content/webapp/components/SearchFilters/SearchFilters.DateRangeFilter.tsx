import Space from '@weco/common/views/components/styled/Space';
import NumberInput from '@weco/content/components/NumberInput';
import { DateRangeFilter as DateRangeFilterType } from '@weco/content/services/wellcome/common/filters';
import { useControlledState } from '@weco/content/utils/useControlledState';

export const dateRegex = /^\d{4}$|^$/;

export type DateRangeFilterProps = {
  f: DateRangeFilterType;
  changeHandler: () => void;
  form?: string;
};

const DateRangeFilter = ({ f, changeHandler, form }: DateRangeFilterProps) => {
  const [from, setFrom] = useControlledState(f.from.value);
  const [to, setTo] = useControlledState(f.to.value);

  return (
    <>
      <Space as="span" $h={{ size: 'm', properties: ['margin-right'] }}>
        <NumberInput
          name={f.from.id}
          label="From"
          min="0"
          max="9999"
          placeholder="Year"
          value={from || ''}
          onChange={event => {
            const val = `${event.currentTarget.value}`;
            setFrom(val);
            if (val.match(dateRegex)) {
              changeHandler();
            }
          }}
          form={form}
        />
      </Space>
      <NumberInput
        name={f.to.id}
        label="to"
        min="0"
        max="9999"
        placeholder="Year"
        value={to || ''}
        onChange={event => {
          const val = `${event.currentTarget.value}`;
          setTo(val);
          if (val.match(dateRegex)) {
            changeHandler();
          }
        }}
        form={form}
      />
    </>
  );
};

export default DateRangeFilter;
