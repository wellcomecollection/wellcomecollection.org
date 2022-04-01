import moment, { Moment } from 'moment';

export function groupIntoSize(array: any[], size): any[][] {
  const result = [] as any[];
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

export function getCalendarRows(date: Moment): (Moment | null)[][] {
  const numberOfDays = date.daysInMonth();
  const days = [...Array(numberOfDays).keys()].map((day, i) => {
    return moment(date).startOf('month').add(i, 'day');
  });
  const firstDay = days[0].day();
  const lastDay = days[days.length - 1].day();
  const emptyStart = [...Array(daysFromStartOfWeek(1, firstDay)).keys()];
  const emptyEnd = [...Array(daysUntilEndOfWeek(1, lastDay)).keys()];
  const rows = [...emptyStart, ...days, ...emptyEnd].map(day => {
    if (typeof day === 'number') {
      return null;
    } else {
      return day;
    }
  });
  return groupIntoSize(rows, 7);
}

// TODO write tests for these
export function firstDayOfWeek(
  date: Moment,
  dates: (Moment | null)[][]
): Moment {
  const currentWeek = dates.find(weekDates =>
    weekDates?.some(weekDate => weekDate?.isSame(date, 'day'))
  );
  return (currentWeek && currentWeek[0]) || date;
}

export function lastDayOfWeek(
  date: Moment,
  dates: (Moment | null)[][]
): Moment {
  const currentWeek = dates.find(week =>
    week?.some(day => day?.isSame(date, 'day'))
  );
  return (currentWeek && currentWeek[currentWeek.length - 1]) || date;
}
