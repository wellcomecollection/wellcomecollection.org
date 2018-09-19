// @flow
import {Fragment} from 'react';
import DateRange from '../DateRange/DateRange';
import HTMLDate from '../HTMLDate/HTMLDate';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import {spacing, classNames} from '../../../utils/classnames';

type Props = {|
  start: Date,
  end: ?Date
|}

const DateAndStatusIndicator = ({start, end}: Props) => (
  <Fragment>
    <div className={classNames({
      [spacing({s: 1}, {margin: ['bottom']})]: true
    })}>
      {end ? <DateRange
        start={new Date(start)}
        end={new Date(end)} />
        : <HTMLDate date={new Date(start)} />
      }
    </div>
    <StatusIndicator start={start} end={(end || new Date())} />
  </Fragment>
);
export default DateAndStatusIndicator;
