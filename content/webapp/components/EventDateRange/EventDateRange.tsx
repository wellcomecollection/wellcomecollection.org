import { DateRange as DateRangeType } from '@weco/common/model/date-range';
import { isSameDay, today } from '@weco/common/utils/dates';
import DateRange from '@weco/common/views/components/DateRange/DateRange';
import { FC } from 'react';
import { HasTimeRanges } from '../../types/events';

type Props = {
  event: HasTimeRanges;
  splitTime?: boolean;
  fromDate?: Date;
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
 *      { start: 1 Oct  @ 9am,  end: 1 Oct  @ 10am }
 *      { start: 1 Nov  @ 9am,  end: 1 Nov  @ 10am }
 *    ]
 *
 * On the event page, we can display the full list of dates, but in certain contexts
 * (e.g. event promo cards, the event header) we can only show a single range.
 * This function choose which range to use.
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
        (isSameDay(end, fromDate) || end > fromDate) &&
        (isSameDay(end, now) || end > now)
    );
}

const EventDateRange: FC<Props> = ({ event, splitTime, fromDate }: Props) => {
  const dateRanges = event.times.map(({ range }) => ({
    start: range.startDateTime,
    end: range.endDateTime,
  }));
  const earliestFutureDateRange = getEarliestFutureDateRange(
    dateRanges,
    fromDate
  );
  const dateRange =
    earliestFutureDateRange || (dateRanges.length > 0 ? dateRanges[0] : null);
  const DateInfo = dateRange && (
    <DateRange {...dateRange} splitTime={splitTime} />
  );

  return DateInfo;
};
export default EventDateRange;
