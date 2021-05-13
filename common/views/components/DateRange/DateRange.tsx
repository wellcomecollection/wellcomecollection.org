import { Fragment, FunctionComponent } from 'react';
import { formatTime, formatDayDate, london } from '../../../utils/format-date';
import HTMLDate from '../HTMLDate/HTMLDate';
import { DateRange as DateRangeProps } from '../../../model/date-range';

type DateProps = {
  date: Date;
};

const HTMLDayDate = ({ date }: DateProps) => (
  <time dateTime={date.toISOString ? date.toISOString() : undefined}>
    {formatDayDate(date)}
  </time>
);

const HTMLTime = ({ date }: DateProps) => (
  <time dateTime={date.toISOString ? date.toISOString() : undefined}>
    {formatTime(date)}
  </time>
);

const TimeRange = ({ start, end }: DateRangeProps) => (
  <Fragment>
    <HTMLTime date={start} />—<HTMLTime date={end} />
  </Fragment>
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

  return (
    <Fragment>
      {isSameDay && (
        <Fragment>
          <HTMLDayDate date={start} />
          {splitTime ? '' : ', '}
          <span className={splitTime ? 'block' : undefined}>
            <TimeRange start={start} end={end} />
          </span>
        </Fragment>
      )}
      {!isSameDay && (
        <Fragment>
          <HTMLDate date={start} />—<HTMLDate date={end} />
        </Fragment>
      )}
    </Fragment>
  );
};

export default DateRange;
