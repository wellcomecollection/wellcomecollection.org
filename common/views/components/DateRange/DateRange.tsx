import { FunctionComponent } from 'react';
import { london } from '../../../utils/format-date';
import HTMLDate from '../HTMLDate/HTMLDate';
import HTMLDayDate from '../HTMLDayDate/HTMLDayDate';
import HTMLTime from '../HTMLTime/HTMLTime';
import { DateRange as DateRangeProps } from '../../../model/date-range';

const TimeRange = ({ start, end }: DateRangeProps) => (
  <>
    <HTMLTime date={start} />—<HTMLTime date={end} />
  </>
);

type Props = {
  splitTime?: boolean;
} & DateRangeProps;
const DateRange: FunctionComponent<Props> = ({
  start,
  end,
  splitTime,
}: Props) => {
  const isSameDay = london(start).isSame(end, 'day');

  return isSameDay ? (
    <>
      <HTMLDayDate date={start} />
      {splitTime ? '' : ', '}
      <span className={splitTime ? 'block' : undefined}>
        <TimeRange start={start} end={end} />
      </span>
    </>
  ) : (
    <>
      <HTMLDate date={start} />—<HTMLDate date={end} />
    </>
  );
};

export default DateRange;
