// eslint-data-component: intentionally omitted
import { FunctionComponent } from 'react';

import { DateRange as DateRangeProps } from '@weco/common/model/date-range';
import { isSameDay } from '@weco/common/utils/dates';
import HTMLDateAndTime from '@weco/common/views/components/HTMLDateAndTime';

const TimeRange = ({ start, end }: DateRangeProps) => (
  <>
    <HTMLDateAndTime variant="time" date={start} /> –{' '}
    <HTMLDateAndTime variant="time" date={end} />
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
      <HTMLDateAndTime variant="dayDate" date={start} />
      {!splitTime && ', '}
      <span style={splitTime ? { display: 'block' } : undefined}>
        <TimeRange start={start} end={end} />
      </span>
    </>
  ) : (
    <>
      <HTMLDateAndTime variant="date" date={start} /> –{' '}
      <HTMLDateAndTime variant="date" date={end} />
    </>
  );
};

export default DateRange;
