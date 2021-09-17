import type { DateRange } from '../model/date-range';
import dayjs, { ConfigType, Dayjs, PluginFunc } from 'dayjs';

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

/*
 * The timezone support in dayjs is not great and contains various bugs.
 * See: https://github.com/iamkun/dayjs/issues?q=timezone
 *
 * We don't really make complex use of the timezone functionality, merely
 * wanting to convert stuff to the current London timezone, so this doesn't
 * seem like a good reason to write off an otherwise good library.
 *
 * The main issue that affects us relates to the incorrect calculation of UTC
 * offsets when dealing with daylight savings time. There is a PR to fix this
 * open in the dayjs repo, which will hopefully be merged soon:
 * https://github.com/iamkun/dayjs/pull/1448
 *
 * Until then, we can replicate the work of that PR by writing an additional
 * plugin which overrides the existing UTC valueOf function with the fixed version
 * from https://github.com/iamkun/dayjs/pull/1448/files#diff-2612403b0bf524678efca9da730f3570b7a058b447238e00dd98d7f3d890abeeR116-R118
 */
const utcFix: PluginFunc = (option, dayjsClass) => {
  dayjsClass.prototype.valueOf = function () {
    const addedOffset = !this.$utils().u(this.$offset)
      ? this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset())
      : 0;
    return this.$d.valueOf() - addedOffset * 60 * 1000;
  };
};
dayjs.extend(utcFix);

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
