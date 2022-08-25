import { FunctionComponent } from 'react';
import HTMLDate from '../HTMLDate/HTMLDate';
import HTMLDayDate from '../HTMLDayDate/HTMLDayDate';
import HTMLTime from '../HTMLTime/HTMLTime';
import { DateRange as DateRangeProps } from '../../../model/date-range';
import { isSameDay } from '../../../utils/dates';

const TimeRange = ({ start, end }: DateRangeProps) => (
  <>
    <HTMLTime date={start} /> – <HTMLTime date={end} />
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
  return isSameDay(start, end) ? (
    <>
      <HTMLDayDate date={start} />
      {splitTime ? '' : ', '}
      <span className={splitTime ? 'block' : undefined}>
        <TimeRange start={start} end={end} />
      </span>
    </>
  ) : (
    <>
      <HTMLDate date={start} /> – <HTMLDate date={end} />
    </>
  );
};

export default DateRange;
