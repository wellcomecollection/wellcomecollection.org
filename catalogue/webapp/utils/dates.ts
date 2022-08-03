import { Moment } from 'moment';
import {
  OpeningHoursDay,
  DayNumber,
  Day,
  ExceptionalOpeningHoursDay,
} from '@weco/common/model/opening-hours';

export function findClosedDays(
  days: (OpeningHoursDay | ExceptionalOpeningHoursDay)[]
): (OpeningHoursDay | ExceptionalOpeningHoursDay)[] {
  return days.filter(day => day.isClosed);
}

export function convertOpeningHoursDayToDayNumber(
  day: OpeningHoursDay
): DayNumber {
  switch (day.dayOfWeek) {
    case 'Monday':
      return 1;
    case 'Tuesday':
      return 2;
    case 'Wednesday':
      return 3;
    case 'Thursday':
      return 4;
    case 'Friday':
      return 5;
    case 'Saturday':
      return 6;
    case 'Sunday':
      return 0;
  }
}

export function convertDayNumberToDay(dayNumber: DayNumber): Day {
  switch (dayNumber) {
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
    case 0:
      return 'Sunday';
  }
}

export function findNextPickUpDay(
  date: Moment,
  regularClosedDays: DayNumber[]
): Moment | undefined {
  if (regularClosedDays.length === 7) {
    // All days are closed, so we'll never be able to find a non closed day.
    return undefined;
  }

  // If the library is closed on this day, we want to set the pick-up day to be
  // the next open day plus one, so that e.g. Monday morning isn't a scramble
  // for library staff handling the weekend's requests. Since this function
  // calls itself recursively, we add one day if we're closed today and
  // tomorrow, but add two days if we're closed today and open tomorrow.

  const nextDay = date.clone().add(1, 'days');
  const isClosed = regularClosedDays.includes(date.day() as DayNumber);
  const isLastClosedDay = !regularClosedDays.includes(
    nextDay.day() as DayNumber
  );

  if (isClosed) {
    return findNextPickUpDay(
      date.add(isLastClosedDay ? 2 : 1, 'day'),
      regularClosedDays
    );
  } else {
    return date;
  }
}

export function determineNextAvailableDate(
  date: Moment,
  regularClosedDays: DayNumber[]
): Moment | undefined {
  const nextAvailableDate = date.clone();
  const isBeforeTen = nextAvailableDate.isBefore(
    date.clone().set({ hour: 10, m: 0, s: 0, ms: 0 })
  );
  nextAvailableDate.add(isBeforeTen ? 1 : 2, 'days');
  return findNextPickUpDay(nextAvailableDate, regularClosedDays);
}

type groupedExceptionalClosedDates = { included: Moment[]; excluded: Moment[] };

export function groupExceptionalClosedDates(params: {
  startDate: Moment;
  endDate: Moment;
  exceptionalClosedDates: Moment[];
}): groupedExceptionalClosedDates {
  const { startDate, endDate, exceptionalClosedDates } = params;
  return exceptionalClosedDates.reduce(
    (returnObj, date) => {
      date.isSameOrAfter(startDate) && date.isSameOrBefore(endDate)
        ? returnObj.included.push(date)
        : returnObj.excluded.push(date);

      return returnObj;
    },
    { included: [], excluded: [] } as groupedExceptionalClosedDates
  );
}

export function filterExceptionalClosedDates(
  exceptionalClosedDates: Moment[],
  regularClosedDays: DayNumber[]
): Moment[] {
  return exceptionalClosedDates.filter(date => {
    return regularClosedDays.every(day => {
      return day !== date.day();
    });
  });
}

export function includedRegularClosedDays(params: {
  startDate: Moment;
  endDate: Moment;
  closedDays: number[];
}): number {
  const { startDate, endDate, closedDays } = params;
  const numberDaysInRange = endDate.diff(startDate, 'days') + 1;
  const dayArray = [...Array(numberDaysInRange).keys()].map(i =>
    startDate.clone().add(i, 'day').day()
  );
  const includedRegularClosedDays = dayArray.filter(day =>
    closedDays.includes(day)
  );
  return includedRegularClosedDays.length;
}

export function extendEndDate(params: {
  startDate?: Moment;
  endDate?: Moment;
  exceptionalClosedDates: Moment[];
  closedDays: DayNumber[];
}): Moment | undefined {
  const { startDate, endDate, exceptionalClosedDates, closedDays } = params;
  if (startDate === undefined || endDate === undefined) return undefined;
  // Filter out any exceptional closed dates fall on regular closed days, as we don't want to include these for extending the end date
  const filteredExceptionalClosedDates = filterExceptionalClosedDates(
    exceptionalClosedDates,
    closedDays
  );
  // Find any exceptional closed dates that occur between the start and end dates
  const groupedClosedDates = groupExceptionalClosedDates({
    startDate: startDate,
    endDate: endDate,
    exceptionalClosedDates: filteredExceptionalClosedDates,
  });
  const exceptionalDaysToAdd = groupedClosedDates.included.length;
  if (exceptionalDaysToAdd === 0) {
    // If there aren't any included exceptional closed dates we can just return the initial end date
    return endDate;
  } else {
    // If there are included exceptional closed dates we need to extend the end date by that number of days
    const extendedEndDate = endDate.clone().add(exceptionalDaysToAdd, 'days');
    // We then regroup the previously excluded exceptional closed dates to see if any are captured by the new end date
    const regroupedClosedDates = groupExceptionalClosedDates({
      startDate: startDate,
      endDate: extendedEndDate,
      exceptionalClosedDates: groupedClosedDates.excluded,
    });
    const additionalExceptionalDaysToAdd = regroupedClosedDates.included.length;
    // And also check if the new end date has captured any of the regular closed days
    const regularDaysToAdd = includedRegularClosedDays({
      startDate: endDate.clone().add(1, 'days'), // We only want to check new days
      endDate: extendedEndDate,
      closedDays,
    });
    const daysToAdd = additionalExceptionalDaysToAdd + regularDaysToAdd;
    if (daysToAdd > 0) {
      // If there are now more days to add on we extend the end date again
      const nextExtendedEndDate = extendedEndDate
        .clone()
        .add(daysToAdd, 'days');
      return extendEndDate({
        startDate: extendedEndDate.clone().add(1, 'day'), // We only want to check new days
        endDate: nextExtendedEndDate,
        exceptionalClosedDates: groupedClosedDates.excluded,
        closedDays,
      });
    } else {
      return extendedEndDate;
    }
  }
}

export function isRequestableDate(params: {
  date: Moment;
  startDate?: Moment;
  endDate?: Moment;
  excludedDates: Moment[];
  excludedDays: DayNumber[];
}): boolean {
  const { date, startDate, endDate, excludedDates, excludedDays } = params;
  const isExceptionalClosedDay = excludedDates.some(moment =>
    moment.isSame(date, 'day')
  );
  const isRegularClosedDay = excludedDays.includes(date.day() as DayNumber);
  return (
    Boolean(
      // no start and end date
      (!startDate && !endDate) ||
        // both start and end date
        (startDate &&
          date.isSameOrAfter(startDate, 'day') &&
          endDate &&
          date.isSameOrBefore(endDate, 'day')) ||
        // only start date
        (startDate && !endDate && date.isSameOrAfter(startDate, 'day')) ||
        // only end date
        (endDate && !startDate && date.isSameOrBefore(endDate, 'day'))
    ) && // both start and end date
    !isExceptionalClosedDay &&
    !isRegularClosedDay
  );
}
