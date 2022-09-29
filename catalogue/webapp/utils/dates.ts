import {
  OpeningHoursDay,
  DayNumber,
  Day,
  ExceptionalOpeningHoursDay,
} from '@weco/common/model/opening-hours';
import {
  addDays,
  getDatesBetween,
  isSameDay,
  isSameDayOrBefore,
} from '@weco/common/utils/dates';

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

type ClosedDates = {
  regularClosedDays: DayNumber[];
  exceptionalClosedDates: Date[];
};

/** Returns true if the library is open on the given date, false otherwise. */
export function isLibraryOpen(
  date: Date,
  { regularClosedDays, exceptionalClosedDates }: ClosedDates
): boolean {
  if (regularClosedDays.includes(date.getDay() as DayNumber)) {
    return false;
  }

  if (
    exceptionalClosedDates.find(exception =>
      isSameDay(date, exception, 'London')
    )
  ) {
    return false;
  }

  return true;
}

/** Returns the next date that the library is open on or after `date`. */
export function findNextOpenDayOnOrAfter(
  date: Date,
  closedDates: ClosedDates
): Date {
  return isLibraryOpen(date, closedDates)
    ? date
    : findNextOpenDayOnOrAfter(addDays(date, 1), closedDates);
}

/** If a reader orders an item today, when's the first time they can come to view
 * it in the library?
 *
 * The logic is as follows: LE&E staff need a complete working day to retrieve
 * the item from the stores, and it's available on the next day after that.
 *
 * e.g. a reader orders an item on Monday.  LE&E staff bring it to the RMR sometime
 * on Tuesday, and the reader can view it on Wednesday.
 */
export function determineNextAvailableDate(
  date: Date,
  regularClosedDays: DayNumber[],
  exceptionalClosedDates: Date[]
): Date | undefined {
  if (regularClosedDays.length === 7) {
    // All days are closed, so we'll never be able to find a non closed day.
    return undefined;
  }

  const hourInLondon = Number(
    date.toLocaleString('en-GB', { hour: 'numeric', timeZone: 'Europe/London' })
  );

  // If a request is made before 10am, staff can retrieve it from the stores today.
  // Otherwise, the earliest staff can retrieve it from the stores is the next day.
  const isBeforeTen = hourInLondon < 10;

  const staffRetrievalDate = findNextOpenDayOnOrAfter(
    isBeforeTen ? date : addDays(date, 1),
    { regularClosedDays, exceptionalClosedDates }
  );

  // The earliest a user can come to view their item is the next open day *after*
  // it's been retrieved by staff.
  const userPickupDate = findNextOpenDayOnOrAfter(
    addDays(staffRetrievalDate, 1),
    { regularClosedDays, exceptionalClosedDates }
  );

  return userPickupDate;
}

type groupedExceptionalClosedDates = { included: Date[]; excluded: Date[] };

export function groupExceptionalClosedDates(params: {
  startDate: Date;
  endDate: Date;
  exceptionalClosedDates: Date[];
}): groupedExceptionalClosedDates {
  const { startDate, endDate, exceptionalClosedDates } = params;
  return exceptionalClosedDates.reduce(
    (returnObj, date) => {
      startDate <= date && date <= endDate
        ? returnObj.included.push(date)
        : returnObj.excluded.push(date);

      return returnObj;
    },
    { included: [], excluded: [] } as groupedExceptionalClosedDates
  );
}

export function filterExceptionalClosedDates(
  exceptionalClosedDates: Date[],
  regularClosedDays: DayNumber[]
): Date[] {
  return exceptionalClosedDates.filter(date => {
    return regularClosedDays.every(day => day !== date.getDay());
  });
}

export function includedRegularClosedDays(params: {
  startDate: Date;
  endDate: Date;
  closedDays: number[];
}): number {
  const { startDate, endDate, closedDays } = params;

  const dayArray = getDatesBetween({ start: startDate, end: endDate }).map(d =>
    d.getDay()
  );

  const includedRegularClosedDays = dayArray.filter(day =>
    closedDays.includes(day)
  );
  return includedRegularClosedDays.length;
}

export function extendEndDate(params: {
  startDate?: Date;
  endDate?: Date;
  exceptionalClosedDates: Date[];
  closedDays: DayNumber[];
}): Date | undefined {
  const { startDate, endDate, exceptionalClosedDates, closedDays } = params;
  if (startDate === undefined || endDate === undefined) return undefined;
  // Filter out any exceptional closed dates fall on regular closed days, as we don't want to include these for extending the end date
  const filteredExceptionalClosedDates = filterExceptionalClosedDates(
    exceptionalClosedDates,
    closedDays
  );
  // Find any exceptional closed dates that occur between the start and end dates
  const groupedClosedDates = groupExceptionalClosedDates({
    startDate,
    endDate,
    exceptionalClosedDates: filteredExceptionalClosedDates,
  });
  const exceptionalDaysToAdd = groupedClosedDates.included.length;
  if (exceptionalDaysToAdd === 0) {
    // If there aren't any included exceptional closed dates we can just return the initial end date
    return endDate;
  } else {
    // If there are included exceptional closed dates we need to extend the end date by that number of days
    const extendedEndDate = addDays(endDate, exceptionalDaysToAdd);
    // We then regroup the previously excluded exceptional closed dates to see if any are captured by the new end date
    const regroupedClosedDates = groupExceptionalClosedDates({
      startDate,
      endDate: extendedEndDate,
      exceptionalClosedDates: groupedClosedDates.excluded,
    });
    const additionalExceptionalDaysToAdd = regroupedClosedDates.included.length;
    // And also check if the new end date has captured any of the regular closed days
    const regularDaysToAdd = includedRegularClosedDays({
      startDate: addDays(endDate, 1), // We only want to check new days
      endDate: extendedEndDate,
      closedDays,
    });
    const daysToAdd = additionalExceptionalDaysToAdd + regularDaysToAdd;
    if (daysToAdd > 0) {
      // If there are now more days to add on we extend the end date again
      const nextExtendedEndDate = addDays(extendedEndDate, daysToAdd);
      return extendEndDate({
        startDate: addDays(extendedEndDate, 1), // We only want to check new days
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
  date: Date;
  startDate?: Date;
  endDate?: Date;
  excludedDates: Date[];
  excludedDays: DayNumber[];
}): boolean {
  const { date, startDate, endDate, excludedDates, excludedDays } = params;
  const isExceptionalClosedDay = excludedDates.some(excluded =>
    isSameDay(excluded, date, 'London')
  );
  const isRegularClosedDay = excludedDays.includes(date.getDay() as DayNumber);
  return (
    Boolean(
      // no start and end date
      (!startDate && !endDate) ||
        // both start and end date
        (startDate &&
          endDate &&
          isSameDayOrBefore(startDate, date) &&
          isSameDayOrBefore(date, endDate)) ||
        // only start date
        (startDate && !endDate && isSameDayOrBefore(startDate, date)) ||
        // only end date
        (endDate && !startDate && isSameDayOrBefore(date, endDate))
    ) && // both start and end date
    !isExceptionalClosedDay &&
    !isRegularClosedDay
  );
}
