// @flow
import {getEarliestFutureDateRange} from '../../../utils/dates';
import DateRange from '../DateRange/DateRange';
import type {UiEvent} from '../../../model/events';
import type Moment from 'moment';
type Props = {|
  event: UiEvent,
  splitTime?: boolean,
  fromDate?: Moment
|}

const EventDateRange = ({event, splitTime, fromDate}: Props) => {
  const dateRanges = event.times.map(({range}) => ({
    start: range.startDateTime,
    end: range.endDateTime
  }));
  const earliestFutureDateRange = getEarliestFutureDateRange(dateRanges, fromDate);
  const dateRange = earliestFutureDateRange || (dateRanges.length > 0 ? dateRanges[0] : null);
  const DateInfo = dateRange && <DateRange {...dateRange} splitTime={splitTime} />;

  return DateInfo;
};
export default EventDateRange;
