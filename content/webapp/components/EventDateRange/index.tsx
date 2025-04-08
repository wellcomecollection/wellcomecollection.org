import { FunctionComponent } from 'react';

import { DateRange as DateRangeType } from '@weco/common/model/date-range';
import { isSameDayOrBefore, today } from '@weco/common/utils/dates';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import DateRange from '@weco/content/components/DateRange/DateRange';
import { EventTime } from '@weco/content/types/events';

type Props = {
  eventTimes: EventTime[];
  splitTime?: boolean;
  fromDate?: Date;
  isPastListing?: boolean;
};

/** Given a list of ranges, returns the first which ends on or after the given
 * date.
 *
 * This is best explained with an example.  Suppose we have an event that repeats
 * across three months: in September, October, and November.  Then it would have
 * three date ranges:
 *
 *    [
 *      { start: 1 Sept @ 9am, end: 1 Sept @ 10am },
 *      { start: 1 Oct  @ 9am, end: 1 Oct  @ 10am }
 *      { start: 1 Nov  @ 9am, end: 1 Nov  @ 10am }
 *    ]
 *
 * On the event page, we can display the full list of dates, but in certain contexts
 * (e.g. event promo cards, the event header) we can only show a single range.
 * This function chooses a suitable snapshot of an event.
 *
 *    - If we're on the event page, we want to highlight the next time this event
 *      is happening.  If today is August, we'd show the event in September.
 *      If today is mid-September, we'd show the event in October.
 *
 *    - On the what's on page, we group events by month, so we show the first event
 *      happening in each month.  If somebody is looking at the October tab, we show
 *      the event in October.  If it's the November tab, it's the November event.
 *
 */
export function getEarliestFutureDateRange(
  dateRanges: DateRangeType[],
  fromDate: Date | undefined = today()
): DateRangeType | undefined {
  const now = today();

  return dateRanges
    .sort((a, b) => (a.start > b.start ? 1 : -1))
    .find(
      ({ end }) =>
        isSameDayOrBefore(fromDate, end) && isSameDayOrBefore(now, end)
    );
}

const EventDateRange: FunctionComponent<Props> = ({
  eventTimes,
  splitTime,
  fromDate,
  isPastListing,
}: Props) => {
  const dateRanges = eventTimes.map(time => ({
    start: time.range.startDateTime,
    end: time.range.endDateTime,
  }));
  const earliestFutureDateRange = getEarliestFutureDateRange(
    dateRanges,
    fromDate
  );
  const earliestDate = dateRanges[0];
  const latestDate = dateRanges[dateRanges.length - 1];
  if (isPastListing && dateRanges.length > 1) {
    return (
      <p>
        Multiple dates between <br />
        <HTMLDate date={earliestDate.start} /> -{' '}
        <HTMLDate date={latestDate.end} />
      </p>
    );
  }
  const dateRange =
    earliestFutureDateRange || (dateRanges.length > 0 ? dateRanges[0] : null);

  return dateRange && <DateRange {...dateRange} splitTime={splitTime} />;
};
export default EventDateRange;
