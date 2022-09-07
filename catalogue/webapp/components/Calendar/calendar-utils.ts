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

export function firstDayOfWeek(date: Date, dates: Date[][]): Date {
  const currentWeek = dates.find(weekDates =>
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
