// @flow
import {Fragment} from 'react';
import {formatTime, formatDayDate, london} from '../../../utils/format-date';
import HTMLDate from '../HTMLDate/HTMLDate';
import type {DateRange as DateRangeProps} from '../../../model/date-range';

type DateProps = {|
  date: Date
|}

const HTMLDayDate = ({ date }: DateProps) => (
  <time dateTime={date.toISOString()}>{formatDayDate(date)}</time>
);

const HTMLTime = ({ date }: DateProps) => (
  <time dateTime={date.toISOString()}>{formatTime(date)}</time>
);

const TimeRange = ({start, end}: DateRangeProps) => (
  <Fragment>
    <HTMLTime date={start} />—<HTMLTime date={end} />
  </Fragment>
);

const DateRange = ({start, end}: DateRangeProps) => {
  const isSameDay = london(start).isSame(end, 'day');

  return (
    <Fragment>
      {isSameDay &&
        <Fragment>
          <HTMLDayDate date={start} />, <TimeRange start={start} end={end} />
        </Fragment>
      }
      {!isSameDay &&
        <Fragment>
          <HTMLDate date={start} />—<HTMLDate date={end} />
        </Fragment>
      }
    </Fragment>
  );
};

export default DateRange;
