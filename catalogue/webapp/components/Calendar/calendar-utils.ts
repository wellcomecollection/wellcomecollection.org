import { getDatesBetween } from '@weco/common/utils/dates';
import moment, { Moment } from 'moment';

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

export function getDatesInMonth(d: Date): Date[] {
  // This gets us the 0th day of the next month, which is
  // really the last day of this month.
  const finalDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

  return getDatesBetween({
    start: new Date(d.getFullYear(), d.getMonth(), 1, 12, 0, 0),
    end: new Date(d.getFullYear(), d.getMonth(), finalDay, 12, 0, 0),
  });
}

export function getCalendarRows(date: Moment): Moment[][] {
  const numberOfDays = date.daysInMonth();
  const days = [...Array(numberOfDays).keys()].map((day, i) => {
    return moment(date).startOf('month').add(i, 'day');
  });
  const firstDay = days[0];
  const lastDay = days[days.length - 1];
  const previousMonthDays = [
    ...Array(daysFromStartOfWeek(1, firstDay.day())).keys(),
  ]
    .map((emptyDay, i) => firstDay?.clone().subtract(i + 1, 'days'))
    .reverse();
  const nextMonthDays = [
    ...Array(daysUntilEndOfWeek(1, lastDay.day())).keys(),
  ].map((emptyDay, i) => lastDay?.clone().add(i + 1, 'days'));
  const rows = [...previousMonthDays, ...days, ...nextMonthDays];
  return groupIntoSize(rows, 7);
}

export function firstDayOfWeek(date: Moment, dates: Moment[][]): Moment {
  const currentWeek = dates.find(weekDates =>
    weekDates?.some(weekDate => weekDate?.isSame(date, 'day'))
  );
  return (currentWeek && currentWeek[0]) || date;
}

export function lastDayOfWeek(date: Moment, dates: Moment[][]): Moment {
  const currentWeek = dates.find(week =>
    week?.some(day => day?.isSame(date, 'day'))
  );
  return (currentWeek && currentWeek[currentWeek.length - 1]) || date;
}
