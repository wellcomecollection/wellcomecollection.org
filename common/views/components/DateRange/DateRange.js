// @flow
import {Fragment} from 'react';
import {formatDate} from '../../../utils/format-date';
type Props = {|
  start: Date,
  end: Date
|}

const DateRange = ({start, end}: Props) => (
  <Fragment>
    <time dateTime={start}>{formatDate(start)}</time>—<time dateTime={end}>{formatDate(end)}</time>
  </Fragment>
);

export default DateRange;
