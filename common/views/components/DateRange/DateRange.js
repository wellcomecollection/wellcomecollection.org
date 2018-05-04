// @flow
import {Fragment} from 'react';
import HTMLDate from '../HTMLDate/HTMLDate';

type Props = {|
  start: Date,
  end: Date
|}

const DateRange = ({start, end}: Props) => (
  <Fragment>
    <HTMLDate date={start} />—<HTMLDate date={end} />
  </Fragment>
);

export default DateRange;
