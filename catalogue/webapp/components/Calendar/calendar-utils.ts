import { addDays, getDatesBetween, isSameDay } from '@weco/common/utils/dates';

export function groupIntoSize<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    const group = array.slice(i, i + size);
    result.push(group);
  }
  return result;
}

export function daysFromStartOfWeek(
  firstDayOfWeek: number,
  firstDayOfMonth: number
): number {
  if (firstDayOfMonth < firstDayOfWeek) {
    return 7 - firstDayOfWeek + firstDayOfMonth;
  } else {
    return 7 - (7 - firstDayOfMonth) - firstDayOfWeek;
  }
}

export function daysUntilEndOfWeek(
  firstDayOfWeek: number,
  lastDayOfMonth: number
): number {
  const lastDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  if (lastDayOfMonth > lastDayOfWeek) {
    return 7 - (lastDayOfMonth - lastDayOfWeek);
  } else {
    return lastDayOfWeek - lastDayOfMonth;
  }
}

export function countDaysInMonth(d: Date): number {
  // This gets us the 0th day of the next month, which is
  // really the last day of this month.
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

export function getDatesInMonth(d: Date): Date[] {
  return getDatesBetween({
    start: new Date(d.getFullYear(), d.getMonth(), 1, 12, 0, 0),
    end: new Date(d.getFullYear(), d.getMonth(), countDaysInMonth(d), 12, 0, 0),
  });
}

export function getCalendarRows(date: Date): Date[][] {
  const days = getDatesInMonth(date);

  const firstDay = days[0];
  const lastDay = days[days.length - 1];
  const previousMonthDays = [
    ...Array(daysFromStartOfWeek(1, firstDay.getDay())).keys(),
  ]
    .map((_, i) => firstDay && addDays(firstDay, -(i + 1)))
    .reverse();
  const nextMonthDays = [
    ...Array(daysUntilEndOfWeek(1, lastDay.getDay())).keys(),
  ].map((_, i) => lastDay && addDays(lastDay, i + 1));
  const rows = [...previousMonthDays, ...days, ...nextMonthDays];
  return groupIntoSize(rows, 7);
}

/** Given a list of weeks, return the first day of the week that
 * contains the given date.
 *
 * e.g. if we're looking for 8 September 2022 in the weeks of September:
 *
 *      September 2022
 *   Mo Tu We Th Fr Sa Su
 * [           1  2  3  4 ]
 * [  5  6  7  8  9 10 11 ] << currentWeek
 * [ 12 13 14 15 16 17 18 ]
 * [ 19 20 21 22 23 24 25 ]
 * [ 26 27 28 29 30       ]
 *
 * then this would return Monday 5 September.
 *
 */
export function firstDayOfWeek(date: Date, weeks: Date[][]): Date {
  const currentWeek = weeks.find(weekDates =>
    weekDates?.some(weekDate => weekDate && isSameDay(weekDate, date))
  );
  return (currentWeek && currentWeek[0]) || date;
}

export function lastDayOfWeek(date: Date, dates: Date[][]): Date {
  const currentWeek = dates.find(week =>
    week?.some(day => day && isSameDay(day, date))
  );
  return (currentWeek && currentWeek[currentWeek.length - 1]) || date;
}

export function addWeeks(d: Date, weeks: number): Date {
  return addDays(d, weeks * 7);
}

export function addMonths(d: Date, months: number): Date {
  const result = new Date(d.getFullYear(), d.getMonth() + months, 1);

  result.setDate(Math.min(d.getDate(), countDaysInMonth(result)));

  return result;
}
