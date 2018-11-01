// @flow
import Prismic from 'prismic-javascript';
import {getDocuments} from './api';
import {isDatePast, london} from '../../utils/format-date';
import groupBy from 'lodash.groupby';
import type {
  Day,
  OverrideType,
  ExceptionalPeriod,
  OverrideDate,
  ExceptionalVenueHours,
  PlacesOpeningHours,
  ExceptionalOpeningHoursDay,
  Venue,
  periodModifiedHours
} from '../../model/opening-hours';
import type {PrismicFragment} from '../../services/prismic/types';
import type Moment from 'moment';

export async function getCollectionOpeningTimes(req: ?Request) {
  const collectionVenues = await getDocuments(req, [Prismic.Predicates.any('document.type', ['collection-venue'])], {});
  return parseVenuesToOpeningHours(collectionVenues);
}

function exceptionalOpeningDates(placesHoursArray: PlacesOpeningHours): OverrideDate[] {
  return [].concat.apply([], placesHoursArray.map(place => { // [].concat.apply to flatten the array
    if (place.openingHours.exceptional) {
      return place.openingHours.exceptional.map(exceptionalDate => {
        return {
          overrideDate: exceptionalDate.overrideDate,
          overrideType: exceptionalDate.overrideType
        };
      });
    } else {
      return [];
    }
  }))
    .filter(override => Boolean(override && override.overrideDate))
    .sort((a, b) => Number(a && a.overrideDate) - Number(b && b.overrideDate))
    .filter((item, i, array) => {
      const firstDate = item && item.overrideDate;
      const lastItem = array && array[i - 1];
      const prevDate = lastItem && lastItem.overrideDate;
      if (!i) {
        return true;
      } else if ((firstDate && firstDate.toDate() instanceof Date) && (prevDate && prevDate.toDate() instanceof Date)) {
        return london(firstDate.toDate()).format('YYYY-MM-DD') !== london(prevDate.toDate()).format('YYYY-MM-DD');
      }
    });
};

function exceptionalOpeningPeriods(dates: OverrideDate[]): ExceptionalPeriod[] {
  let groupedIndex = 0;

  return dates.reduce((acc, date, i, array) => {
    const previousDate = array[i - 1] && array[i - 1].overrideDate ? array[i - 1].overrideDate : null;
    if (!previousDate) {
      acc[groupedIndex] = {
        type: 'other',
        dates: []
      };
      acc[groupedIndex].type = date.overrideType || 'other';
      acc[groupedIndex].dates = [];
      acc[groupedIndex].dates.push(date);
    } else if (previousDate && date.overrideDate.isBefore(previousDate.clone().add(6, 'days'))) {
      acc[groupedIndex].dates.push(date);
    } else {
      groupedIndex++;
      acc[groupedIndex] = {
        type: 'other',
        dates: []
      };
      acc[groupedIndex].type = date.overrideType || 'other';
      acc[groupedIndex].dates = [];
      acc[groupedIndex].dates.push(date);
    }

    return acc;
  }, []);
}

export function exceptionalOpeningPeriodsAllDates(exceptionalOpeningPeriods: ?ExceptionalPeriod[]): ?{type: OverrideType, dates: Moment[]}[] {
  return exceptionalOpeningPeriods && exceptionalOpeningPeriods.map((period) => {
    const startDate = london(period.dates[0].overrideDate.toDate()).startOf('day');
    const lastDate = london(period.dates[period.dates.length - 1].overrideDate.toDate()).startOf('day');
    const completeDateArray = [];
    while (startDate.startOf('day').isSameOrBefore(lastDate)) {
      const current = startDate.format('YYYY-MM-DD');
      completeDateArray.push(london(new Date(current)));
      startDate.add(1, 'day');
    }
    return {
      type: period.type,
      dates: completeDateArray
    };
  });
}

function regularTimesbyDay(placesOpeningHours: PlacesOpeningHours, currentDate: Moment) {
  const currentDay = currentDate.format('dddd');
  return placesOpeningHours.map((place) => {
    const hours = place.openingHours.regular.find(hours => hours.dayOfWeek === currentDay);
    return  {
      exceptionalDate: currentDate,
      exceptionalDay: currentDay,
      id: place.id,
      name: place.name,
      order: place.order,
      openingHours: {
        // overrideDate: currentDate, // TODO - check works
        dayOfWeek: currentDay,
        opens: hours && hours.opens,
        closes: hours && hours.closes
      }
    };
  });
}

export function exceptionalOpeningHoursByPeriod(
  upcomingPeriodsComplete: ?{type: OverrideType, dates: Moment[]}[],
  exceptionalHoursByDate: {
    [string]: ExceptionalVenueHours[]
  },
  placesOpeningHours: PlacesOpeningHours
): ?periodModifiedHours[] {
  return upcomingPeriodsComplete && upcomingPeriodsComplete.map((period) => {
    const periodStart = period.dates[0];
    const periodEnd = period.dates[period.dates.length - 1];
    const dates = period && period.dates && period.dates.map((periodDate) => {
      const current = periodDate.format('YYYY-MM-DD');
      const hours = exceptionalHoursByDate[current];
      if (hours) {
        return hours;
      } else {
        return regularTimesbyDay(placesOpeningHours, london(periodDate.toDate()));
      }
    }).filter(Boolean);
    return {
      periodStart: periodStart,
      periodEnd: periodEnd,
      dates
    };
  });
};

function identifyChanges(override: ?ExceptionalOpeningHoursDay, place: Venue, exceptionalDay: Day) {
  const regular = place.openingHours.regular.find(item => item.dayOfWeek === exceptionalDay);
  return {
    opensHasChanged: override && regular && regular.opens !== override.opens,
    closesHasChanged: override && regular && regular.closes !== override.closes
  };
}

function exceptionalOpeningHours(dates: OverrideDate[], placesOpeningHours: PlacesOpeningHours) {
  return [].concat.apply([], dates.reduce((acc, exceptionalDate) => {
    const exceptionalDay = london(exceptionalDate.overrideDate.toDate()).format('dddd');
    const overrides = placesOpeningHours.map(place => {
      const override = place.openingHours.exceptional &&
      place.openingHours.exceptional.find(item => {
        if (item.overrideDate && exceptionalDate.overrideDate) {
          return london(item.overrideDate.toDate()).format('YYYY-MM-DD') === london(exceptionalDate.overrideDate.toDate()).format('YYYY-MM-DD');
        }
      });
      const changes = identifyChanges(override, place, exceptionalDay);
      const openingHours = override || place.openingHours.regular.find(item => item.dayOfWeek === exceptionalDay);
      return {
        exceptionalDate,
        exceptionalDay,
        id: place.id,
        name: place.name,
        order: place.order,
        openingHours,
        opensChanged: changes.opensHasChanged,
        closesChanged: changes.closesHasChanged
      };
    });
    acc.push(overrides);

    return acc;
  }, [])).sort((a, b) => {
    return a.order - b.order;
  });
}

function upcomingExceptionalOpeningPeriods(periods: ExceptionalPeriod[]) {
  const exceptionalPeriods =  periods && periods.filter((period) => {
    const displayPeriodStart = london().subtract(1, 'day');
    const displayPeriodEnd = london().add(15, 'day');
    return period.dates[0].overrideDate.clone().isBetween(displayPeriodStart, displayPeriodEnd) || period.dates[period.dates.length - 1].overrideDate.clone().isBetween(displayPeriodStart, displayPeriodEnd);
  });

  return exceptionalPeriods.length > 1 ? exceptionalPeriods : null;
}

function exceptionalClosedDates(exceptionalOpeningHours: ?periodModifiedHours[]): ?{periodStart: Moment, periodEnd: Moment, venues: {
  [string]: []
}}[] {
  const onlyClosedByVenue = exceptionalOpeningHours && exceptionalOpeningHours.map(period => {
    const dates = [].concat(...period.dates.map(dates => {
      return dates.filter(venue => !venue.openingHours.opens);
    }));
    const venues = groupBy(dates, venue => venue.name);

    return {
      periodStart: period.periodStart,
      periodEnd: period.periodEnd,
      venues
    };
  })
    .filter(period => {
      return Object.keys(period.venues).length > 0;
    });

  return onlyClosedByVenue;
}

function createRegularDay(day: Day, venue: PrismicFragment) {
  const lowercaseDay = day.toLowerCase();
  const start = venue.data[lowercaseDay][0].startDateTime;
  const end = venue.data[lowercaseDay][0].endDateTime;
  if (start && end) {
    return {
      dayOfWeek: day,
      opens: london(start).format('HH:mm'),
      closes: london(end).format('HH:mm')
    };
  } else {
    return {
      dayOfWeek: day,
      opens: null,
      closes: null
    };
  }
}

export function parseVenuesToOpeningHours(doc: PrismicFragment) {
  const placesOpeningHours =  doc.results.map((venue) => {
    const exceptionalOpeningHours = venue.data.modifiedDayOpeningTimes.map((modified) => {
      const start = modified.startDateTime && london(modified.startDateTime).format('HH:mm');
      const end = modified.startDateTime && london(modified.endDateTime).format('HH:mm');
      const overrideDate = modified.overrideDate && london(modified.overrideDate);
      const overrideType = modified.type;
      return {
        overrideDate,
        overrideType,
        opens: start,
        closes: end
      };
    });
    return {
      id: venue.id,
      name: venue.data.title,
      order: venue.data.order,
      openingHours: {
        regular: [
          createRegularDay('Monday', venue),
          createRegularDay('Tuesday', venue),
          createRegularDay('Wednesday', venue),
          createRegularDay('Thursday', venue),
          createRegularDay('Friday', venue),
          createRegularDay('Saturday', venue),
          createRegularDay('Sunday', venue)
        ],
        exceptional: exceptionalOpeningHours
      }
    };
  });

  const exceptionalDates = exceptionalOpeningDates(placesOpeningHours);
  const futureExceptionalDates = exceptionalDates && exceptionalDates.filter(exceptionalDate => exceptionalDate && exceptionalDate.overrideDate && !isDatePast(exceptionalDate.overrideDate.toDate()));
  const exceptionalPeriods = exceptionalOpeningPeriods(futureExceptionalDates);
  const individualExceptionalOpeningHours = exceptionalOpeningHours(futureExceptionalDates, placesOpeningHours);
  const exceptionalHours = groupBy(individualExceptionalOpeningHours, item => london(item.exceptionalDate.overrideDate).format('YYYY-MM-DD'));
  const orderedHours = {};
  Object.keys(exceptionalHours).sort().forEach(key => orderedHours[key] = exceptionalHours[key]);
  const exceptionalOpening = exceptionalOpeningHoursByPeriod(exceptionalOpeningPeriodsAllDates(exceptionalPeriods), orderedHours, placesOpeningHours);
  return {
    placesOpeningHours: placesOpeningHours.sort((a, b) => {
      return a.order - b.order;
    }),
    upcomingExceptionalOpeningPeriods: exceptionalOpeningPeriodsAllDates(upcomingExceptionalOpeningPeriods(exceptionalPeriods)),
    exceptionalOpeningHours: exceptionalOpening,
    exceptionalClosedDates: exceptionalClosedDates(exceptionalOpening)
  };
}
