// @flow
import {
  /* isDatePast, */
  london,
} from '../../utils/format-date';
// import sortBy from 'lodash.groupby';
import type {
  Day,
  // OverrideType,
  // ExceptionalPeriod,
  // OverrideDate,
  // ExceptionalVenueHours,
  // PlacesOpeningHours,
  ExceptionalOpeningHoursDay,
  Venue,
  // periodModifiedHours,
} from '../../model/opening-hours';
import { type PrismicFragment } from '../../services/prismic/types';
// import type Moment from 'moment';

// TODO merge David's branch
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

// export function exceptionalOpeningHoursByPeriod(
//   upcomingPeriodsComplete: ?({ type: OverrideType, dates: Moment[] }[]),
//   exceptionalHoursByDate: {
//     [string]: ExceptionalVenueHours[],
//   },
//   placesOpeningHours: PlacesOpeningHours
// ): ?(periodModifiedHours[]) {
//   return (
//     upcomingPeriodsComplete &&
//     upcomingPeriodsComplete.map(period => {
//       const periodStart = period.dates[0];
//       const periodEnd = period.dates[period.dates.length - 1];
//       const dates =
//         period &&
//         period.dates &&
//         period.dates
//           .map(periodDate => {
//             const current = periodDate.format('YYYY-MM-DD');
//             const hours = exceptionalHoursByDate[current];
//             if (hours) {
//               return hours;
//             } else {
//               return regularTimesbyDay(
//                 placesOpeningHours,
//                 london(periodDate.toDate())
//               );
//             }
//           })
//           .filter(Boolean);
//       return {
//         periodStart: periodStart,
//         periodEnd: periodEnd,
//         dates,
//       };
//     })
//   );
// }

// function identifyChanges(
//   override: ?ExceptionalOpeningHoursDay,
//   place: Venue,
//   exceptionalDay: Day
// ) {
//   const regular = place.openingHours.regular.find(
//     item => item.dayOfWeek === exceptionalDay
//   );
//   return {
//     opensHasChanged: override && regular && regular.opens !== override.opens,
//     closesHasChanged: override && regular && regular.closes !== override.closes,
//   };
// }

// function exceptionalOpeningHours(
//   dates: OverrideDate[],
//   placesOpeningHours: PlacesOpeningHours
// ) {
//   return [].concat
//     .apply(
//       [],
//       dates.reduce((acc, exceptionalDate) => {
//         const exceptionalDay = london(
//           exceptionalDate.overrideDate.toDate()
//         ).format('dddd');
//         const overrides = placesOpeningHours.map(place => {
//           const override =
//             place.openingHours.exceptional &&
//             place.openingHours.exceptional.find(item => {
//               if (item.overrideDate && exceptionalDate.overrideDate) {
//                 return (
//                   london(item.overrideDate.toDate()).format('YYYY-MM-DD') ===
//                   london(exceptionalDate.overrideDate.toDate()).format(
//                     'YYYY-MM-DD'
//                   )
//                 );
//               }
//             });
//           const changes = identifyChanges(override, place, exceptionalDay);
//           const openingHours =
//             override ||
//             place.openingHours.regular.find(
//               item => item.dayOfWeek === exceptionalDay
//             );
//           return {
//             exceptionalDate,
//             exceptionalDay,
//             id: place.id,
//             name: place.name,
//             order: place.order,
//             openingHours,
//             opensChanged: changes.opensHasChanged,
//             closesChanged: changes.closesHasChanged,
//           };
//         });
//         acc.push(overrides);

//         return acc;
//       }, [])
//     )
//     .sort((a, b) => {
//       return a.order - b.order;
//     });
// }

// function upcomingExceptionalOpeningPeriods(
//   periods: ExceptionalPeriod[],
//   daysInAdvance: number = 15
// ) {
//   const exceptionalPeriods =
//     periods &&
//     periods.filter(period => {
//       const displayPeriodStart = london().subtract(1, 'day');
//       const displayPeriodEnd = london().add(daysInAdvance, 'day');
//       return (
//         period.dates[0].overrideDate
//           .clone()
//           .isBetween(displayPeriodStart, displayPeriodEnd) ||
//         period.dates[period.dates.length - 1].overrideDate
//           .clone()
//           .isBetween(displayPeriodStart, displayPeriodEnd)
//       );
//     });

//   return exceptionalPeriods.length > 0 ? exceptionalPeriods : null;
// }

// function exceptionalClosedDates(
//   exceptionalOpeningHours: ?(periodModifiedHours[])
// ): ?({
//   periodStart: Moment,
//   periodEnd: Moment,
//   venues: {
//     [string]: [],
//   },
// }[]) {
//   const onlyClosedByVenue =
//     exceptionalOpeningHours &&
//     exceptionalOpeningHours
//       .map(period => {
//         const dates = [].concat(
//           ...period.dates.map(dates => {
//             return dates.filter(venue => !venue.openingHours.opens);
//           })
//         );
//         const venues = groupBy(dates, venue => venue.name);

//         return {
//           periodStart: period.periodStart,
//           periodEnd: period.periodEnd,
//           venues,
//         };
//       })
//       .filter(period => {
//         return Object.keys(period.venues).length > 0;
//       });

//   return onlyClosedByVenue;
// }
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

function exceptionalFromRegular(venue: Venue, dateToGet: Moment) {
  const currentDay = dateToGet.format('dddd');
  const regular = venue.openingHours.regular.find(
    hours => hours.dayOfWeek === currentDay
  );
  return {
    overrideDate: dateToGet,
    overrideType: null,
    opens: regular ? regular.opens : null,
    closes: regular ? regular.closes : null,
  };
}

// TODO tidy once working properly
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
        const days = sortedDates.map(date => {
          const matchingVenueGroup = groupedExceptionalDays.find(group => {
            return group.find(day => day.overrideDate.isSame(date, 'day'));
          });
          const matchingDay =
            matchingVenueGroup &&
            matchingVenueGroup.find(day =>
              day.overrideDate.isSame(date, 'day')
            );
          const backfillDay = exceptionalFromRegular(venue, date);
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
        d.overrideDate.isSameOrBefore(
          london()
            .subtract(373, 'day') // TODO put back to today after finished dev
            .add(14, 'day'),
          'day'
        ) && d.overrideDate.isSameOrAfter(london().subtract(373, 'day'), 'day')
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
    order: venue.order,
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
