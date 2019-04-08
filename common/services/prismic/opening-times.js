// @flow
import {
  /* isDatePast, */
  london,
} from '../../utils/format-date';
// import sortBy from 'lodash.groupby';
import type {
  Day,
  OverrideType,
  // ExceptionalPeriod,
  OverrideDate,
  // ExceptionalVenueHours,
  // PlacesOpeningHours,
  ExceptionalOpeningHoursDay,
  Venue,
} from '../../model/opening-hours';
import { type PrismicFragment } from '../../services/prismic/types';

// TODO add comprehensive comments
// TODO remove unused code
// TODO get rid of the stuff we don't need anymore
// TODO flow

export function exceptionalOpeningDates(
  placesHoursArray: Venue[]
): OverrideDate[] {
  return [].concat
    .apply(
      [],
      placesHoursArray.placesOpeningHours.map(place => {
        if (place.openingHours.exceptional) {
          return place.openingHours.exceptional.map(exceptionalDate => {
            return {
              overrideDate: exceptionalDate.overrideDate,
              overrideType: exceptionalDate.overrideType,
            };
          });
        } else {
          return [];
        }
      })
    )
    .filter(override => Boolean(override && override.overrideDate))
    .sort((a, b) => Number(a && a.overrideDate) - Number(b && b.overrideDate))
    .filter((item, i, array) => {
      const firstDate = item && item.overrideDate;
      const lastItem = array && array[i - 1];
      const prevDate = lastItem && lastItem.overrideDate;
      if (!i) {
        return true;
      } else if (
        firstDate &&
        firstDate.toDate() instanceof Date &&
        (prevDate && prevDate.toDate() instanceof Date)
      ) {
        return (
          london(firstDate.toDate()).format('YYYY-MM-DD') !==
          london(prevDate.toDate()).format('YYYY-MM-DD')
        );
      }
    });
}

export function exceptionalOpeningPeriods(
  dates: OverrideDate[]
): ExceptionalPeriod[] {
  let groupedIndex = 0;

  return dates.reduce((acc, date, i, array) => {
    const previousDate =
      array[i - 1] && array[i - 1].overrideDate
        ? array[i - 1].overrideDate
        : null;
    if (!previousDate) {
      acc[groupedIndex] = {
        type: 'other',
        dates: [],
      };
      acc[groupedIndex].type = date.overrideType || 'other';
      acc[groupedIndex].dates = [];
      acc[groupedIndex].dates.push(date);
    } else if (
      previousDate &&
      date.overrideDate.isBefore(previousDate.clone().add(6, 'days'))
    ) {
      acc[groupedIndex].dates.push(date);
    } else {
      groupedIndex++;
      acc[groupedIndex] = {
        type: 'other',
        dates: [],
      };
      acc[groupedIndex].type = date.overrideType || 'other';
      acc[groupedIndex].dates = [];
      acc[groupedIndex].dates.push(date);
    }

    return acc;
  }, []);
}

export function exceptionalOpeningPeriodsAllDates(
  exceptionalOpeningPeriods: ?(ExceptionalPeriod[])
): ?({ type: OverrideType, dates: Moment[] }[]) {
  return (
    exceptionalOpeningPeriods &&
    exceptionalOpeningPeriods.map(period => {
      const startDate = london(period.dates[0].overrideDate.toDate()).startOf(
        'day'
      );
      const lastDate = london(
        period.dates[period.dates.length - 1].overrideDate.toDate()
      ).startOf('day');
      const completeDateArray = [];
      while (startDate.startOf('day').isSameOrBefore(lastDate)) {
        const current = startDate.format('YYYY-MM-DD');
        completeDateArray.push(london(new Date(current)));
        startDate.add(1, 'day');
      }
      return {
        type: period.type,
        dates: completeDateArray,
      };
    })
  );
}

// TODO flow
export function getExceptionalVenueDays(
  venue: Venue
): ExceptionalOpeningHoursDay[] {
  return (venue.openingHours && venue.openingHours.exceptional) || [];
}

export function groupExceptionalVenueDays(
  exceptionalDays: ExceptionalOpeningHoursDay[]
): ExceptionalOpeningHoursDay[][] {
  return exceptionalDays.length > 0
    ? exceptionalDays
        .sort((a, b) => {
          return a.overrideDate.diff(b.overrideDate, 'days');
        })
        .reduce(
          (acc, date) => {
            const group = acc[acc.length - 1];
            if (
              date.overrideDate.diff(
                (group[0] && group[0].overrideDate) || date.overrideDate,
                'days'
              ) > 14
            ) {
              acc.push([date]);
            } else {
              group.push(date);
            }
            return acc;
          },
          [[]]
        )
    : [];
}

function exceptionalFromRegular(venue: Venue, dateToGet: Moment, type: string) {
  const currentDay = dateToGet.format('dddd');
  const regular = venue.openingHours.regular.find(
    hours => hours.dayOfWeek === currentDay
  );
  return {
    overrideDate: dateToGet,
    overrideType: type,
    opens: regular ? regular.opens : null,
    closes: regular ? regular.closes : null,
  };
}

export function backfillExceptionalVenueDays(
  venue: Venue,
  allVenueExceptionalPeriods?: any // TODO
): ExceptionalOpeningHoursDay[][] {
  const groupedExceptionalDays = groupExceptionalVenueDays(
    getExceptionalVenueDays(venue)
  );
  return (
    allVenueExceptionalPeriods &&
    allVenueExceptionalPeriods
      .map(period => {
        const sortedDates = period.dates.sort((a, b) => {
          return a.diff(b, 'days');
        });
        const type = period.type;
        const days = sortedDates.map(date => {
          const matchingVenueGroup = groupedExceptionalDays.find(group => {
            return group.find(day => day.overrideDate.isSame(date, 'day'));
          });
          const matchingDay =
            matchingVenueGroup &&
            matchingVenueGroup.find(day =>
              day.overrideDate.isSame(date, 'day')
            );
          const backfillDay = exceptionalFromRegular(venue, date, type);
          return matchingDay || backfillDay;
        });
        return days;
      })
      .filter(Boolean)
  );
}

export function groupConsecutiveDays(
  openingHoursPeriods: ExceptionalOpeningHoursDay[][]
): ExceptionalOpeningHoursDay[][] {
  const flattenedArray = openingHoursPeriods.reduce(
    (acc, curr) => acc.concat(curr),
    []
  );
  return (
    flattenedArray.length > 0 &&
    flattenedArray
      .sort((a, b) => {
        return a.overrideDate.diff(b.overrideDate, 'days');
      })
      .reduce(
        (acc, date) => {
          const group = acc[acc.length - 1];
          if (
            date.overrideDate.diff(
              (group[group.length - 1] &&
                group[group.length - 1].overrideDate) ||
                date.overrideDate,
              'days'
            ) > 1
          ) {
            acc.push([date]);
          } else {
            group.push(date);
          }
          return acc;
        },
        [[]]
      )
  );
}

export function getUpcomingExceptionalPeriod(exceptionalPeriods) {
  const nextUpcomingPeriod = exceptionalPeriods.filter(period => {
    const upcomingPeriod = period.find(d => {
      return (
        d.overrideDate.isSameOrBefore(london().add(14, 'day'), 'day') &&
        d.overrideDate.isSameOrAfter(london(), 'day')
      );
    });
    return upcomingPeriod || false;
  });
  return nextUpcomingPeriod;
}

export function getExceptionalClosedDays(
  openingHoursPeriods: ExceptionalOpeningHoursDay[][]
): ExceptionalOpeningHoursDay[][] {
  return openingHoursPeriods.map(period =>
    period.filter(date => date.opens === null)
  );
}

function createRegularDay(day: Day, venue: PrismicFragment) {
  const lowercaseDay = day.toLowerCase();
  const start = venue.data[lowercaseDay][0].startDateTime;
  const end = venue.data[lowercaseDay][0].endDateTime;
  if (start && end) {
    return {
      dayOfWeek: day,
      opens: london(start).format('HH:mm'),
      closes: london(end).format('HH:mm'),
    };
  } else {
    return {
      dayOfWeek: day,
      opens: null,
      closes: null,
    };
  }
}

// TODO rename!!  Takes the slice JSON and converts it to the Venue shape: rename Venue type?
export function parseVenueTimesToOpeningHours(
  venue: any // TODO
): Venue {
  const data = venue.data;
  const exceptionalOpeningHours = venue.data.modifiedDayOpeningTimes.map(
    modified => {
      const start =
        modified.startDateTime &&
        london(modified.startDateTime).format('HH:mm');
      const end =
        modified.startDateTime && london(modified.endDateTime).format('HH:mm');
      const overrideDate =
        modified.overrideDate && london(modified.overrideDate);
      const overrideType = modified.type;
      return {
        overrideDate,
        overrideType,
        opens: start,
        closes: end,
      };
    }
  );

  return {
    id: venue.id,
    order: data.order,
    name: data.title,
    openingHours: {
      regular: [
        createRegularDay('Monday', venue),
        createRegularDay('Tuesday', venue),
        createRegularDay('Wednesday', venue),
        createRegularDay('Thursday', venue),
        createRegularDay('Friday', venue),
        createRegularDay('Saturday', venue),
        createRegularDay('Sunday', venue),
      ],
      exceptional: exceptionalOpeningHours,
    },
  };
}

export function parseVenuesToOpeningHours(doc: PrismicFragment) {
  const placesOpeningHours = doc.results.map(venue => {
    return parseVenueTimesToOpeningHours(venue);
  });

  return {
    collectionOpeningTimes: {
      placesOpeningHours: placesOpeningHours.sort((a, b) => {
        return a.order - b.order;
      }),
    },
  };
}

export function getTodaysVenueHours(venue: Venue) {
  const todaysDate = london().startOf('day');
  const todayString = todaysDate.format('dddd');
  const exceptionalOpeningHours =
    venue.openingHours.exceptional &&
    venue.openingHours.exceptional.find(i => {
      const dayOfWeek = london(i.overrideDate).startOf('day');
      return todaysDate.isSame(dayOfWeek);
    });
  const regularOpeningHours =
    venue.openingHours.regular &&
    venue.openingHours.regular.find(i => i.dayOfWeek === todayString);
  return exceptionalOpeningHours || regularOpeningHours;
}
