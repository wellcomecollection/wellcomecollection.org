import { font } from '@weco/common/utils/classnames';
import { formatDate, formatDayName } from '@weco/common/utils/format-date';
import HTMLDateAndTime from '@weco/common/views/components/HTMLDateAndTime';
import Space from '@weco/common/views/components/styled/Space';

type DateRangeProps = {
  dateRange: { start: Date; end?: Date };
  period: string;
};

const DateRange = ({ dateRange, period }: DateRangeProps) => {
  const { start, end } = dateRange;
  return (
    <Space
      $v={{
        size: 's',
        properties: ['margin-bottom'],
      }}
      as="p"
      className={font('intr', -1)}
    >
      {period === 'today' && <HTMLDateAndTime variant="date" date={start} />}
      {period === 'this-weekend' && (
        <>
          <time dateTime={formatDate(start)}>{formatDayName(start)}</time>
          {' – '}
          {/*
            When the period is 'this-weekend', the dates come from getNextWeekendDateRange,
            which always includes a start and an end, so we can safely non-null here.

            We could get this working in the type system, but it's a more invasive change.
          */}
          <time dateTime={formatDate(end!)}>{formatDayName(end!)}</time>
        </>
      )}
      {period === 'current-and-coming-up' && (
        <>
          From <HTMLDateAndTime variant="date" date={start} />
        </>
      )}
    </Space>
  );
};

export default DateRange;
