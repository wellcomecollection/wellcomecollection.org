import { Moment } from 'moment';
import { Day } from '@weco/common/model/opening-hours';

export function getDayNumber(day: Day): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  switch (day) {
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
  regularClosedDays: (0 | 1 | 2 | 3 | 4 | 5 | 6)[]
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
  regularClosedDays: number[];
}): number {
  const { startDate, endDate, regularClosedDays } = params;
  const numberDaysInRange = endDate.diff(startDate, 'days') + 1;
  const dayArray = [...Array(numberDaysInRange).keys()].map(i =>
    startDate.clone().add(i, 'day').day()
  );
  const includedRegularClosedDays = dayArray.filter(day =>
    regularClosedDays.includes(day)
  );
  return includedRegularClosedDays.length;
}

export function extendEndDate(params: {
  startDate: Moment;
  endDate: Moment;
  exceptionalClosedDates: Moment[];
  regularClosedDays: (0 | 1 | 2 | 3 | 4 | 5 | 6)[];
}): Moment {
  const { startDate, endDate, exceptionalClosedDates, regularClosedDays } =
    params;
  // Filter out any exceptional closed dates fall on regular closed days, as we don't want to include these for extending the end date
  const filteredExceptionalClosedDates = filterExceptionalClosedDates(
    exceptionalClosedDates,
    regularClosedDays
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
      regularClosedDays: regularClosedDays,
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
        regularClosedDays,
      });
    } else {
      return extendedEndDate;
    }
  }
}
