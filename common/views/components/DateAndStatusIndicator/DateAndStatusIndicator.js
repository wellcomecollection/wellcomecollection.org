// @flow
import { Fragment } from 'react';
import DateRange from '../DateRange/DateRange';
import HTMLDate from '../HTMLDate/HTMLDate';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import Space from '../styled/Space';

type Props = {|
  start: Date,
  end: ?Date,
|};

const DateAndStatusIndicator = ({ start, end }: Props) => (
  <Fragment>
    <Space v={{ size: 's', properties: ['margin-bottom'] }}>
      {end ? (
        <DateRange start={new Date(start)} end={new Date(end)} />
      ) : (
        <HTMLDate date={new Date(start)} />
      )}
    </Space>
    <StatusIndicator start={start} end={end || new Date()} />
  </Fragment>
);
export default DateAndStatusIndicator;
