import { Query } from '@prismicio/types';
import { london } from '../../utils/format-date';
import type {
  Day,
  OverrideType,
  ExceptionalPeriod,
  OverrideDate,
  ExceptionalOpeningHoursDay,
  Venue,
  PlacesOpeningHours,
} from '../../model/opening-hours';
import { CollectionVenuePrismicDocument } from '../../services/prismic/types';
import { Moment } from 'moment';
import { asText } from '../../services/prismic/parsers';
import { objToJsonLd } from '../../utils/json-ld';
import { isNotUndefined } from '../../utils/array';
import { OpeningTimes } from '../../views/components/OpeningTimesContext/OpeningTimesContext';

// TODO add comprehensive comments and probably rename some functions

export function exceptionalOpeningDates(collectionOpeningTimes: {
  placesOpeningHours: Venue[];
}): OverrideDate[] {
  return collectionOpeningTimes.placesOpeningHours
    .flatMap(place => {
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
      date.overrideDate?.isBefore(previousDate.clone().add(6, 'days')) &&
      date.overrideType === acc[groupedIndex].type
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
  }, [] as ExceptionalPeriod[]);
}

type OverrideDates = {
  type: OverrideType | null;
  dates: Moment[];
};

export function exceptionalOpeningPeriodsAllDates(
  exceptionalOpeningPeriods?: ExceptionalPeriod[]
): OverrideDates[] {
  return exceptionalOpeningPeriods
    ? exceptionalOpeningPeriods.map(period => {
        const startDate: Moment = london(
          period.dates[0]?.overrideDate?.toDate()
        ).startOf('day');

        const lastDate: Moment = london(
          period.dates[period.dates.length - 1]?.overrideDate?.toDate()
        ).startOf('day');

        const completeDateArray: moment.Moment[] = [];

        while (startDate.startOf('day').isSameOrBefore(lastDate)) {
          const current = startDate.format('YYYY-MM-DD');
          const currentDate: moment.Moment = london(new Date(current));
          completeDateArray.push(currentDate);
          startDate.add(1, 'day');
        }

        return {
          type: period.type,
          dates: completeDateArray,
        };
      })
    : [];
}

export function getExceptionalOpeningPeriods(openingTimes: {
  collectionOpeningTimes: {
    placesOpeningHours: PlacesOpeningHours;
  };
}) {
  const allExceptionalDates = exceptionalOpeningDates(
    openingTimes.collectionOpeningTimes
  );
  const groupedExceptionalDates =
    allExceptionalDates && exceptionalOpeningPeriods(allExceptionalDates);
  return (
    groupedExceptionalDates &&
    exceptionalOpeningPeriodsAllDates(groupedExceptionalDates)
  );
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

function exceptionalFromRegular(
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
    opens: regular ? regular.opens : undefined,
    closes: regular ? regular.closes : undefined,
  };
}

export function backfillExceptionalVenueDays(
  venue: Venue,
  allVenueExceptionalPeriods?: OverrideDates[]
): ExceptionalOpeningHoursDay[][] {
  const groupedExceptionalDays = groupExceptionalVenueDays(
    getExceptionalVenueDays(venue)
  );

  // if it's type is other then we don't backfill
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
        const matchingDay =
          matchingVenueGroup &&
          matchingVenueGroup.find(day => day.overrideDate?.isSame(date, 'day'));
        const backfillDay = exceptionalFromRegular(venue, date, type);
        if (type === 'other') {
          return matchingDay;
        } else {
          return matchingDay || backfillDay;
        }
      })
      .filter(isNotUndefined);
    return days;
  });
}

export function groupConsecutiveDays(
  openingHoursPeriods: ExceptionalOpeningHoursDay[][]
): ExceptionalOpeningHoursDay[][] {
  return openingHoursPeriods
    .reduce((acc, curr) => acc.concat(curr), [])
    .sort((a, b) => {
      return a.overrideDate?.diff(b.overrideDate, 'days') ?? 0;
    })
    .reduce(
      (acc, date) => {
        const group = acc[acc.length - 1];
        if (
          date.overrideDate &&
          date.overrideDate.diff(
            (group[group.length - 1] && group[group.length - 1].overrideDate) ||
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

export function getExceptionalClosedDays(
  openingHoursPeriods: ExceptionalOpeningHoursDay[][]
): ExceptionalOpeningHoursDay[][] {
  return openingHoursPeriods.map(period =>
    period.filter(date => date.opens === null)
  );
}

function createRegularDay(day: Day, venue: CollectionVenuePrismicDocument) {
  const data: any = venue.data;
  const lowercaseDay = day.toLowerCase();
  const start = data && data[lowercaseDay][0].startDateTime;
  const end = data && data[lowercaseDay][0].endDateTime;
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

export function convertJsonDateStringsToMoment(jsonVenue: Venue): Venue {
  const exceptionalMoment =
    jsonVenue.openingHours.exceptional &&
    jsonVenue.openingHours.exceptional.map(e => ({
      ...e,
      overrideDate: london(e.overrideDate),
    }));
  return {
    ...jsonVenue,
    openingHours: {
      regular: jsonVenue.openingHours.regular,
      exceptional: exceptionalMoment,
    },
  };
}

export function parseCollectionVenue(
  venue: CollectionVenuePrismicDocument
): Venue {
  const data = venue.data;
  const exceptionalOpeningHours = data.modifiedDayOpeningTimes.map(modified => {
    const start: Moment | undefined = modified.startDateTime
      ? london(modified.startDateTime).format('HH:mm')
      : undefined;
    const end: Moment | undefined = modified.startDateTime
      ? london(modified.endDateTime).format('HH:mm')
      : undefined;
    const overrideDate: Moment | undefined = modified.overrideDate
      ? london(modified.overrideDate)
      : undefined;
    const overrideType = modified.type ?? undefined;
    return {
      overrideDate,
      overrideType,
      opens: start,
      closes: end,
    };
  });

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
      exceptional: exceptionalOpeningHours,
    },
    image: data.image,
    url: 'url' in data.link ? data.link.url : undefined,
    linkText: asText(data?.linkText),
  };
}

export function getParseCollectionVenueById(
  collectionVenues: {
    collectionOpeningTimes: {
      placesOpeningHours: Venue[];
    };
  },
  id: string
): any {
  const venue = collectionVenues.collectionOpeningTimes.placesOpeningHours.find(
    venue => venue.id === id
  );
  return venue;
}

export function parseCollectionVenues(
  doc: Query<CollectionVenuePrismicDocument>
): OpeningTimes {
  const placesOpeningHours = doc.results.map(venue => {
    return parseCollectionVenue(venue);
  });

  return {
    collectionOpeningTimes: {
      placesOpeningHours: placesOpeningHours.sort((a, b) => {
        return Number(a.order) - Number(b.order);
      }),
      upcomingExceptionalOpeningPeriods: [],
    },
    placesOpeningHours: [],
    upcomingExceptionalOpeningPeriods: [],
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

export function openingHoursToOpeningHoursSpecification(openingHours: any) {
  return {
    openingHoursSpecification:
      openingHours && openingHours.regular
        ? openingHours.regular.map(openingHoursDay => {
            const specObject = objToJsonLd(
              openingHoursDay,
              'OpeningHoursSpecification',
              false
            );
            delete specObject.note;
            return specObject;
          })
        : [],
    specialOpeningHoursSpecification:
      openingHours &&
      openingHours.exceptional &&
      openingHours.exceptional.map(openingHoursDate => {
        const specObject = {
          opens: openingHoursDate.opens,
          closes: openingHoursDate.closes,
          validFrom: openingHoursDate.overrideDate.format('DD MMMM YYYY'),
          validThrough: openingHoursDate.overrideDate.format('DD MMMM YYYY'),
        };
        return objToJsonLd(specObject, 'OpeningHoursSpecification', false);
      }),
  };
}
