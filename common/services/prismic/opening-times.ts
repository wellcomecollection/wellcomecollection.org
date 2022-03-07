import { Query } from '@prismicio/types';
import { london } from '../../utils/format-date';
import groupBy from 'lodash.groupby';
import type {
  Day,
  OverrideType,
  ExceptionalPeriod,
  OverrideDate,
  Venue,
  OpeningHoursDay,
  ExceptionalOpeningHoursDay,
} from '../../model/opening-hours';
import { CollectionVenuePrismicDocument } from '../../services/prismic/documents';
import { Moment } from 'moment';
import { isNotUndefined } from '../../utils/array';
import * as prismicH from 'prismic-helpers-beta';

export function exceptionalOpeningDates(venues: Venue[]): OverrideDate[] {
  return venues
    .flatMap(venue => {
      if (venue.openingHours.exceptional) {
        return venue.openingHours.exceptional.map(exceptionalDate => {
          return {
            overrideDate: exceptionalDate.overrideDate,
            overrideType: exceptionalDate.overrideType,
          };
        });
      } else {
        return [];
      }
    })
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
        prevDate &&
        prevDate.toDate() instanceof Date
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
  dates.sort((a, b) => Number(a.overrideDate) - Number(b.overrideDate));

  const exceptionalPeriods = Object.values(
    groupBy(dates, date => date.overrideType)
  ).flat();

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
        date.overrideDate?.isBefore(previousDate.clone().add(6, 'days')) &&
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
      // order groups by their earlist date
      return a.dates[0].isBefore(b.dates[0]) ? -1 : 1;
    });
}

export function exceptionalOpeningPeriodsAllDates(
  exceptionalOpeningPeriods: ExceptionalPeriod[]
): ExceptionalPeriod[] {
  return exceptionalOpeningPeriods.map(period => {
    const startDate = period.dates[0];
    const lastDate = period.dates[period.dates.length - 1];

    const arrayLength = lastDate.diff(startDate, 'days') + 1;
    const completeDateArray = [...Array(arrayLength).keys()].map(i => {
      return startDate.clone().add(i, 'days');
    });

    return {
      type: period.type,
      dates: completeDateArray,
    };
  });
}

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
          return a.overrideDate?.diff(b.overrideDate, 'days') ?? 0;
        })
        .reduce(
          (acc, date) => {
            const group = acc[acc.length - 1];
            if (
              (date.overrideDate?.diff(
                (group[0] && group[0].overrideDate) || date.overrideDate,
                'days'
              ) ?? 0) > 14
            ) {
              acc.push([date]);
            } else {
              group.push(date);
            }
            return acc;
          },
          [[]] as ExceptionalOpeningHoursDay[][]
        )
    : [];
}

export function exceptionalFromRegular(
  venue: Venue,
  dateToGet: Moment,
  type: OverrideType
): ExceptionalOpeningHoursDay {
  const currentDay = dateToGet.format('dddd');
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

export function backfillExceptionalVenueDays(
  venue: Venue,
  allVenueExceptionalPeriods?: ExceptionalPeriod[]
): ExceptionalOpeningHoursDay[][] {
  const groupedExceptionalDays = groupExceptionalVenueDays(
    getExceptionalVenueDays(venue)
  );
  return (allVenueExceptionalPeriods ?? []).map(period => {
    const sortedDates = period.dates.sort((a, b) => {
      return a.diff(b, 'days');
    });
    const type = period.type || 'other';
    const days = sortedDates
      .map(date => {
        const matchingVenueGroup = groupedExceptionalDays.find(group => {
          return group.find(day => day.overrideDate?.isSame(date, 'day'));
        });
        const matchingDay = matchingVenueGroup?.find(day =>
          day.overrideDate?.isSame(date, 'day')
        );
        const backfillDay = exceptionalFromRegular(venue, date, type);
        if (type === 'other') {
          // We don't backfill if its type is other - see https://github.com/wellcomecollection/wellcomecollection.org/pull/4437
          return matchingDay;
        } else {
          return matchingDay || backfillDay;
        }
      })
      .filter(isNotUndefined);
    return days;
  });
}

export function groupConsecutiveExceptionalDays(
  dates: ExceptionalOpeningHoursDay[]
): ExceptionalOpeningHoursDay[][] {
  return dates
    .sort((a, b) => {
      return a.overrideDate?.diff(b.overrideDate, 'days') ?? 0;
    })
    .reduce(
      (acc, date) => {
        const group = acc[acc.length - 1];
        if (
          date.overrideDate.diff(
            group[group.length - 1]?.overrideDate,
            'days'
          ) > 1
        ) {
          acc.push([date]);
        } else {
          group.push(date);
        }
        return acc;
      },
      [[]] as ExceptionalOpeningHoursDay[][]
    );
}

export function getUpcomingExceptionalPeriods(
  exceptionalPeriods: ExceptionalOpeningHoursDay[][]
): ExceptionalOpeningHoursDay[][] {
  const nextUpcomingPeriods = exceptionalPeriods.filter(period => {
    const upcomingPeriod = period.find(d => {
      return (
        d.overrideDate?.isSameOrBefore(london().add(28, 'day'), 'day') &&
        d.overrideDate?.isSameOrAfter(london(), 'day')
      );
    });
    return upcomingPeriod || false;
  });
  return nextUpcomingPeriods;
}

export function createRegularDay(
  day: Day,
  venue: CollectionVenuePrismicDocument
): OpeningHoursDay {
  const { data } = venue;
  const lowercaseDay = day.toLowerCase();
  const start = data && data[lowercaseDay][0].startDateTime;
  const end = data && data[lowercaseDay][0].endDateTime;
  const isClosed = !start;
  // If there is no start time from prismic, then we set both opens and closes to 00:00.
  // This is necessary for the json-ld schema data, so Google knows when the venues are closed.
  // See https://developers.google.com/search/docs/advanced/structured-data/local-business#business-hours (All-day hours tab)
  // "To show a business is closed all day, set both opens and closes properties to '00:00'""
  return {
    dayOfWeek: day,
    opens: start ? london(start).format('HH:mm') : '00:00',
    closes: start && end ? london(end).format('HH:mm') : '00:00',
    isClosed,
  };
}

export function parseCollectionVenue(
  venue: CollectionVenuePrismicDocument
): Venue {
  const data = venue.data;
  const exceptionalOpeningHours = data.modifiedDayOpeningTimes
    ? data.modifiedDayOpeningTimes
        .filter(modified => modified.overrideDate)
        .map(modified => {
          const start = modified.startDateTime;
          const end = modified.endDateTime;
          const isClosed = !start;
          const overrideDate = modified.overrideDate
            ? london(modified.overrideDate)
            : undefined;
          const overrideType = modified.type ?? 'other';
          if (overrideDate) {
            return {
              overrideDate,
              overrideType,
              // If there is no start time from prismic, then we set both opens and closes to 00:00.
              // This is necessary for the json-ld schema data, so Google knows when the venues are closed.
              // See https://developers.google.com/search/docs/advanced/structured-data/local-business#business-hours (All-day hours tab)
              // "To show a business is closed all day, set both opens and closes properties to '00:00'""
              opens: start ? london(start).format('HH:mm') : '00:00',
              closes: start && end ? london(end).format('HH:mm') : '00:00',
              isClosed,
            };
          }
        })
    : [];

  return {
    id: venue.id as string,
    order: data.order ?? undefined,
    name: data.title ?? '',
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
      exceptional: exceptionalOpeningHours.filter(isNotUndefined),
    },
    image: data.image,
    url: 'url' in data.link ? data.link.url : undefined,
    linkText: prismicH.asText(data?.linkText),
  };
}

export function getVenueById(venues: Venue[], id: string): Venue | undefined {
  const venue = venues.find(venue => venue.id === id);
  return venue;
}

export function parseCollectionVenues(
  doc: Query<CollectionVenuePrismicDocument>
): Venue[] {
  const venues = doc.results.map(venue => {
    return parseCollectionVenue(venue);
  });

  return venues.sort((a, b) => {
    return Number(a.order) - Number(b.order);
  });
}

export function getTodaysVenueHours(
  venue: Venue
): ExceptionalOpeningHoursDay | OpeningHoursDay | undefined {
  const todaysDate = london();
  const todayString = todaysDate.format('dddd');
  const exceptionalOpeningHours =
    venue.openingHours.exceptional &&
    venue.openingHours.exceptional.find(i =>
      todaysDate.startOf('day').isSame(i.overrideDate.startOf('day'))
    );
  const regularOpeningHours =
    venue.openingHours.regular &&
    venue.openingHours.regular.find(i => i.dayOfWeek === todayString);
  return exceptionalOpeningHours || regularOpeningHours;
}
