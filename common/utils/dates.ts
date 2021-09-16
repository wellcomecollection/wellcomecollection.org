import 'moment-timezone';
import type { DateRange } from '../model/date-range';
import dayjs, { ConfigType, Dayjs } from 'dayjs';

import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import minMax from 'dayjs/plugin/minMax';
import objectSupport from 'dayjs/plugin/objectSupport';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(minMax);
dayjs.extend(objectSupport);

export function london(d?: ConfigType): Dayjs {
  return dayjs.tz(d, 'Europe/London');
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

export function formatDate(date: Date): string {
  return london(date).format('D MMMM YYYY');
}

export function formatTime(date: Date): string {
  return london(date).format('HH:mm');
}

export function isTimePast(date: Date): boolean {
  const now = london();
  const end = london(date);

  return end.isBefore(now);
}

export function isDatePast(date: Date): boolean {
  const now = london();
  const end = london(date);

  return end.isBefore(now, 'day');
}

export function isDateFuture(date: Date): boolean {
  return london(date).isAfter(london(), 'day');
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
  } else if (now.isBetween(e.subtract(1, 'w'), e, 'day')) {
    return { text: 'Final week', color: 'orange' };
  } else {
    return { text: 'Now on', color: 'green' };
  }
}

export function getEarliestFutureDateRange(
  dateRanges: DateRange[],
  fromDate: Date = london().toDate()
): DateRange | undefined {
  const min = dayjs.max(dayjs(fromDate), london());
  return dateRanges
    .filter(({ end }) => london(end).isSameOrAfter(min))
    .reduce((earliest, dateRange) =>
      dateRange.start < earliest.start ? dateRange : earliest
    );
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
  const date =
    dateString && dayjs(new Date(Number(dateString), 0, 1, 0, 0, 0, 0));

  return date && date.isValid() ? date.format('YYYY-MM-DD') : undefined;
}
