// @flow
import {getEarliestFutureDateRange} from '../../../utils/dates';
import DateRange from '../DateRange/DateRange';
import type {UiEvent} from '../../../model/events';
type Props = {|
  event: UiEvent
|}

const EventDateRange = ({event}: Props) => {
  const dateRanges = event.times.map(({range}) => ({
    start: range.startDateTime,
    end: range.endDateTime
  }));
  const earliestFutureDateRange = getEarliestFutureDateRange(dateRanges);
  const dateRange = earliestFutureDateRange || (dateRanges.length > 0 ? dateRanges[0] : null);
  const DateInfo = dateRange && <DateRange {...dateRange} />;

  return DateInfo;
};
export default EventDateRange;
