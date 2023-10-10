import { formatDayName } from '../../utils/format-date';
import {
  OverrideType,
  ExceptionalPeriod,
  OverrideDate,
  Venue,
  OpeningHoursDay,
  ExceptionalOpeningHoursDay,
  HasOverrideDate,
} from '../../model/opening-hours';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  addDays,
  countDaysBetween,
  getDatesBetween,
  isSameDay,
  isSameDayOrBefore,
  today,
} from '../../utils/dates';

const ONE_WEEK = 7;

// We need to make sure exceptional opening times appear on the website so
// that people who are travelling a long way (e.g. from overseas) have enough
// time to plan their visit to Wellcome Collection, especially in advance,
// e.g. over the Christmas/New Year's holiday.
//
// It was decided that six weeks in advance should suffice
// https://wellcome.slack.com/archives/C3N7J05TK/p1668523930526009
const EXCEPTIONAL_OPENING_DATES_ADVANCE_NOTICE_PERIOD = 6 * ONE_WEEK;

/** Returns a list of OverrideDate for which any venue has exceptional hours.
 * The list will be sorted in chronological order.
 *
 * e.g. if we had two venues
 *
 *    library.exceptionalOpeningHours = [3 Jan, 2 Jan, 1 Jan]
 *    gallery.exceptionalOpeningHours = [3 Jan, 4 Jan, 5 Feb]
 *
 * then this would return
 *
 *    [1 Jan, 2 Jan, 3 Jan, 4 Jan, 5 Feb]
 *
 * Note: this assumes that two venues with an override on the same date will
 * always have the same overrideType.
 *
 */
export function getOverrideDatesForAllVenues(venues: Venue[]): OverrideDate[] {
  return venues
    .flatMap(venue => venue.openingHours.exceptional)
    .map(({ overrideDate, overrideType }) => ({ overrideDate, overrideType }))
    .sort((a, b) => Number(a.overrideDate) - Number(b.overrideDate))
    .reduce((result: OverrideDate[], thisOverride: OverrideDate) => {
      const isAlreadyInResult = result.some(t =>
        isSameDay(t.overrideDate, thisOverride.overrideDate)
      );

      if (!isAlreadyInResult) {
        result.push(thisOverride);
      }

      return result;
    }, []);
}

/** Groups the list of OverrideDates based on:
 *
 *    - whether they fall on dates that are within a week of each other
 *    - whether they have the same override type
 *
 * The groups will be returned in chronological order of their first date.
 *
 * e.g. if we had a list of dates
 *
 *    1 Jan / bank holiday
 *    2 Jan / bank holiday
 *    3 Jan / late spectacular
 *    4 Jan / late spectacular
 *    5 Jan / bank holiday
 *    6 Feb / other
 *    7 Feb / bank holiday
 *
 * it would create four groups:
 *
 *    [1 Jan, 2 Jan, 5 Jan] / bank holiday
 *    [3 Jan, 4 Jan]        / late spectacular
 *    [6 Feb]               / other
 *    [7 Feb]               / bank holiday
 *
 * Note: this function expects that there will be at most one `OverrideDate` for
 * each calendar date.
 *
 */
export function groupOverrideDates(dates: OverrideDate[]): ExceptionalPeriod[] {
  dates.sort((a, b) => Number(a.overrideDate) - Number(b.overrideDate));

  const groupedExceptionalPeriods: Record<OverrideType, OverrideDate[]> =
    dates.reduce(
      (acc, date) => {
        if (Object.keys(acc).includes(date.overrideType)) {
          acc[date.overrideType].push(date);
        } else {
          acc[date.overrideType] = [date];
        }
        return acc;
      },
      {} as Record<OverrideType, OverrideDate[]>
    );

  const exceptionalPeriods = Object.values(groupedExceptionalPeriods).flat();

  let groupedIndex = 0;
  return exceptionalPeriods
    .reduce((acc, date, i, array) => {
      const previousDate = array[i - 1]?.overrideDate
        ? array[i - 1].overrideDate
        : null;
      if (!previousDate) {
        acc[groupedIndex] = {
          type: date.overrideType,
          dates: [date.overrideDate],
        };
      } else if (
        previousDate &&
        date.overrideDate < addDays(previousDate, 6) &&
        date.overrideType === acc[groupedIndex].type
      ) {
        acc[groupedIndex].dates.push(date.overrideDate);
      } else {
        groupedIndex++;
        acc[groupedIndex] = {
          type: date.overrideType,
          dates: [date.overrideDate],
        };
      }
      return acc;
    }, [] as ExceptionalPeriod[])
    .sort((a, b) => {
      // order groups by their earliest date
      return a.dates[0] < b.dates[0] ? -1 : 1;
    });
}

/** Replace the dates on each exceptional period with a complete set of dates.
 *
 * e.g. if we had an exceptional period
 *
 *    type  = other
 *    dates = 1 Jan, 2 Jan, 5 Jan
 *
 * the dates would be replaced with the complete range
 *
 *    type  = other
 *    dates = 1 Jan, 2 Jan, 3 Jan, 4 Jan, 5 Jan
 *
 * Note: this function assumes the dates on each ExceptionalPeriod are already sorted.
 *
 */
export function completeDateRangeForExceptionalPeriods(
  exceptionalOpeningPeriods: ExceptionalPeriod[]
): ExceptionalPeriod[] {
  return exceptionalOpeningPeriods.map(period => {
    const startDate = period.dates[0];
    const endDate = period.dates[period.dates.length - 1];

    const completeDateArray = getDatesBetween({ startDate, endDate });

    return {
      type: period.type,
      dates: completeDateArray,
    };
  });
}

/** Groups a list of exceptional opening days.
 *
 * Each group will have at most 14 days between the first day and the last day.
 *
 */
export function groupExceptionalVenueDays<T extends HasOverrideDate>(
  exceptionalDays: T[]
): T[][] {
  return exceptionalDays.length > 0
    ? exceptionalDays
        .sort((a, b) => countDaysBetween(a.overrideDate, b.overrideDate))
        .reduce(
          (acc, date) => {
            const group = acc[acc.length - 1];

            const daysBetween =
              (date.overrideDate &&
                group[0]?.overrideDate &&
                countDaysBetween(date.overrideDate, group[0].overrideDate)) ??
              0;

            if (daysBetween > 14) {
              acc.push([date]);
            } else {
              group.push(date);
            }
            return acc;
          },
          [[]] as T[][]
        )
    : [];
}

export function exceptionalFromRegular(
  venue: Venue,
  dateToGet: Date,
  type: OverrideType
): ExceptionalOpeningHoursDay {
  const currentDay = formatDayName(dateToGet);
  const regular = venue.openingHours.regular.find(
    hours => hours.dayOfWeek === currentDay
  );

  return {
    overrideDate: dateToGet,
    overrideType: type,
    opens: regular?.opens || '00:00',
    closes: regular?.closes || '00:00',
    isClosed:
      regular?.isClosed ||
      (regular?.opens === '00:00' && regular?.closes === '00:00'),
  };
}

type ExceptionalOpeningHoursGroup = ExceptionalOpeningHoursDay[];

/** Returns groups of ExceptionalOpeningHoursDay for this venue.
 *
 * Each group contains a complete set of opening hours for a venue within
 * the group's period (at most fourteen days).
 *
 *      Mon 1 Jan  = 11am – 5pm
 *      Tues 2 Jan = 10am – 6pm
 *      Weds 3 Jan = 11am – 5pm
 *
 *      Mon 1 Feb  = closed
 *      Tues 2 Feb = 10am – 6pm
 *      Weds 3 Feb = closed
 *
 */
export function createExceptionalOpeningHoursDays(
  venue: Venue,
  allVenueExceptionalPeriods: ExceptionalPeriod[]
): ExceptionalOpeningHoursGroup[] {
  const groupedExceptionalDays = groupExceptionalVenueDays(
    venue.openingHours.exceptional
  );
  return allVenueExceptionalPeriods.map(period => {
    const sortedDates = period.dates.sort((a, b) => countDaysBetween(a, b));
    const type = period.type || 'other';
    const days = sortedDates
      .map(date => {
        const matchingVenueGroup = groupedExceptionalDays.find(group =>
          group.find(day => isSameDay(day.overrideDate, date))
        );
        const matchingDay = matchingVenueGroup?.find(day =>
          isSameDay(day.overrideDate, date)
        );
        const backfillDay = exceptionalFromRegular(venue, date, type);
        return matchingDay || backfillDay;
      })
      .filter(isNotUndefined);
    return days;
  });
}

/** Given a single list of exceptional dates, split them into a list of lists,
 * where each list is a consecutive run of dates.
 *
 * e.g. input  = [Jan 1, Jan 2, Jan 3, Feb 4, Mar 5, Mar 6]
 *
 *      output = [[Jan 1, Jan 2, Jan 3],
 *                [Feb 4],
 *                [Mar 5, Mar 6]]
 *
 */
export function groupConsecutiveExceptionalDays<T extends HasOverrideDate>(
  dates: T[]
): T[][] {
  return dates
    .sort((a, b) => (a.overrideDate > b.overrideDate ? 1 : -1))
    .reduce((acc, date) => {
      const group = acc[acc.length - 1];
      const lastDayOfGroup = group && group[group.length - 1]?.overrideDate;

      if (
        lastDayOfGroup &&
        isSameDay(addDays(date.overrideDate, -1), lastDayOfGroup)
      ) {
        group.push(date);
      } else {
        acc.push([date]);
      }

      return acc;
    }, [] as T[][]);
}

/** Returns a list of all exceptional periods that we want to display.
 *
 * This includes exceptional periods happening today, so that if somebody looks at
 * the site on an exceptional day, it highlights the exceptional hours.  We filter
 * this list so we’re not displaying dates very far in the future.
 */
export function getUpcomingExceptionalOpeningHours<T extends HasOverrideDate>(
  openingHoursGroups: T[][]
): T[][] {
  return openingHoursGroups.filter(period =>
    period.some(
      d =>
        isSameDayOrBefore(today(), d.overrideDate) &&
        isSameDayOrBefore(
          d.overrideDate,
          addDays(today(), EXCEPTIONAL_OPENING_DATES_ADVANCE_NOTICE_PERIOD)
        )
    )
  );
}

export function getVenueById(venues: Venue[], id: string): Venue | undefined {
  return venues.find(venue => venue.id === id);
}

export function getTodaysVenueHours(
  venue: Venue
): ExceptionalOpeningHoursDay | OpeningHoursDay | undefined {
  const todaysDate = today();
  const todayString = formatDayName(todaysDate);
  const exceptionalOpeningHours = venue.openingHours.exceptional.find(i =>
    isSameDay(todaysDate, i.overrideDate)
  );
  const regularOpeningHours = venue.openingHours.regular.find(
    i => i.dayOfWeek === todayString
  );
  return exceptionalOpeningHours || regularOpeningHours;
}
