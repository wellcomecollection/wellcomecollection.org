// @flow
import { Fragment } from 'react';
import DateRange from '../DateRange/DateRange';
import HTMLDate from '../HTMLDate/HTMLDate';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {|
  start: Date,
  end: ?Date,
|};

const DateAndStatusIndicator = ({ start, end }: Props) => (
  <Fragment>
    <VerticalSpace size="s">
      {end ? (
        <DateRange start={new Date(start)} end={new Date(end)} />
      ) : (
        <HTMLDate date={new Date(start)} />
      )}
    </VerticalSpace>
    <StatusIndicator start={start} end={end || new Date()} />
  </Fragment>
);
export default DateAndStatusIndicator;
