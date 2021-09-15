import 'moment-timezone';
import type { DateRange } from '../model/date-range';
import moment, { Moment } from 'moment';

export function london(
  d?: Date | string | Moment | { M: string } | { year: string }
): Moment {
  return moment.tz(d, 'Europe/London');
}

export function formatDay(date: Date): string {
  return london(date).format('dddd');
}

export function formatDayDate(date: Date): string {
  return london(date).format('dddd D MMMM YYYY');
}

export function formatDayMonth(date: Date): string {
  return london(date).format('D MMMM');
}

export function formatDate(date: Date | Moment): string {
  return london(date).format('D MMMM YYYY');
}

export function formatTime(date: Date): string {
  return london(date).format('HH:mm');
}

export function isTimePast(date: Date): boolean {
  const momentNow = london();
  const momentEnd = london(date);

  return momentEnd.isBefore(momentNow);
}

export function isDatePast(date: Date): boolean {
  const momentNow = london();
  const momentEnd = london(date);

  return momentEnd.isBefore(momentNow, 'day');
}

export function formatDateRangeWithMessage({
  start,
  end,
}: {
  start: Date;
  end: Date;
}): { text: string; color: string } {
  const now = london();
  const s = london(start);
  const e = london(end);

  if (s.isAfter(now, 'day')) {
    return { text: 'Coming soon', color: 'marble' };
  } else if (e.isBefore(now, 'day')) {
    return { text: 'Past', color: 'marble' };
  } else if (now.isBetween(e.clone().subtract(1, 'w'), e, 'day')) {
    return { text: 'Final week', color: 'orange' };
  } else {
    return { text: 'Now on', color: 'green' };
  }
}

export function getEarliestFutureDateRange(
  dateRanges: DateRange[],
  fromDate: Moment = london()
): DateRange | undefined {
  return dateRanges
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .find(
      range =>
        london(range.end).isSameOrAfter(fromDate, 'day') &&
        london(range.end).isSameOrAfter(london(), 'day')
    );
}

export function isPast(date: Date): boolean {
  return london(date).isBefore(london(), 'day');
}

export function isFuture(date: Date): boolean {
  return london(date).isAfter(london(), 'day');
}

export function getNextWeekendDateRange(date: Date): DateRange {
  const today = london(date);
  const todayInteger = today.day(); // day() return Sun as 0, Sat as 6

  const start =
    todayInteger !== 0 ? london(today).day(5) : london(today).day(-2);
  const end = todayInteger === 0 ? london(today) : london(today).day(7);

  return {
    start: start.startOf('day').toDate(),
    end: end.endOf('day').toDate(),
  };
}

export function formatDateForApi(dateString: string): string | undefined {
  const date = dateString && london({ year: dateString });

  return date && date.isValid() ? date.format('YYYY-MM-DD') : undefined;
}
