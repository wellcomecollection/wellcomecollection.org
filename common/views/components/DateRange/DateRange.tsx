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

/** Renders a date/time range.
 *
 * Examples:
 *
 *    1 March 2022 – 8 March 2022
 *
 *    1 March 2022, 13:15 – 14:15
 *
 *    1 March 2022
 *    13:15 – 14:15
 *
 * The component will automatically decide whether to render a date range
 * or a date and time range.  The `splitTime` prop controls whether the
 * time is shown on a separate line.
 *
 */
const DateRange: FunctionComponent<Props> = ({ start, end, splitTime }) => {
  return isSameDay(start, end) ? (
    <>
      <HTMLDayDate date={start} />
      {!splitTime && ', '}
      <span style={splitTime ? { display: 'block' } : undefined}>
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
