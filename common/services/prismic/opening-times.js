// @flow
import Prismic from 'prismic-javascript';
import {getDocuments} from './api';
import {isDatePast, london} from '../../utils/format-date';
import groupBy from 'lodash.groupby';
import type {ExceptionalVenueHours, PlacesOpeningHours, ExceptionalOpeningHoursDay, Venue, Days, OpeningTimes} from '../../model/opening-hours';
import type {PrismicFragment} from '../../services/prismic/types';
import type Moment from 'moment';
// TODO - modified and closure times are wrong
export async function getCollectionOpeningTimes() {
  const collectionVenues = await getDocuments(null, [Prismic.Predicates.any('document.type', ['collection-venue'])], {});
  return parseVenuesToOpeningHours(collectionVenues);
}

function exceptionalOpeningDates(placesHoursArray: PlacesOpeningHours) {
  return [].concat.apply([], placesHoursArray.map(place => { // [].concat.apply to flatten the array
    return place.openingHours.exceptional &&
      place.openingHours.exceptional.map(exceptionalDate => {
        return {
          overrideDate: exceptionalDate.overrideDate,
          overrideType: exceptionalDate.overrideType
        };
      });
  }))
    .filter(override => Boolean(override.overrideDate))
    .sort((a, b) => Number(a.overrideDate) - Number(b.overrideDate))
    .filter((item, i, array) => {
      const firstDate = item.overrideDate;
      const prevDate = array[i - 1] && array[i - 1].overrideDate;
      if (!i) {
        return true;
      } else if ((firstDate && firstDate.toDate() instanceof Date) && (prevDate && prevDate.toDate() instanceof Date)) {
        return london(firstDate).format('YYYY-MM-DD') !== london(prevDate).format('YYYY-MM-DD');
      }
    });
};

function exceptionalOpeningPeriods(dates: {overrideDate: Moment, overrideType: string}[]) {
  let groupedIndex = 0;

  return dates.reduce((acc, date, i, array) => {
    const previousDate = array[i - 1] && array[i - 1].overrideDate ? array[i - 1].overrideDate : null;

    if (!previousDate) {
      acc[groupedIndex] = [];
      acc[groupedIndex].push(date);
    } else if (previousDate && date.overrideDate.isBefore(previousDate.clone().add(6, 'days'))) {
      acc[groupedIndex].push(date);
    } else {
      groupedIndex++;
      acc[groupedIndex] = [];
      acc[groupedIndex].push(date);
    }

    return acc;
  }, []);
}

export function exceptionalOpeningPeriodsAllDates(
  exceptionalOpeningPeriods: ?Moment[][]
): ?any[] {
  return exceptionalOpeningPeriods && exceptionalOpeningPeriods.map((periodDateArray) => {
    const startDate = london(periodDateArray[0].overrideDate.toDate()).startOf('day');
    const lastDate = london(periodDateArray[periodDateArray.length - 1].overrideDate.toDate()).startOf('day');
    const completeDateArray = [];
    while (startDate.startOf('day').isSameOrBefore(lastDate)) {
      const current = startDate.format('YYYY-MM-DD');
      completeDateArray.push(london(new Date(current)));
      startDate.add(1, 'day');
    }
    return completeDateArray;
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
        overrideDate: currentDate,
        dayOfWeek: currentDay,
        opens: hours && hours.opens,
        closes: hours && hours.closes
      }
    };
  });
}

export function exceptionalOpeningHoursByPeriod(
  upcomingPeriodsComplete: ?Moment[][],
  exceptionalHoursByDate: {},
  placesOpeningHours: PlacesOpeningHours
): ?any[] {
  return upcomingPeriodsComplete && upcomingPeriodsComplete.map((period) => {
    const periodStart = period[0];
    const periodEnd = period[period.length - 1];
    const dates = period && period.map((periodDate) => {
      const current = periodDate.format('YYYY-MM-DD');
      const hours = exceptionalHoursByDate[current];
      if (hours) {
        return hours;
      } else {
        return regularTimesbyDay(placesOpeningHours, periodDate);
      }
    }).filter(Boolean);
    return {
      periodStart: periodStart,
      periodEnd: periodEnd,
      dates
    };
  });
};

function identifyChanges(override: ?ExceptionalOpeningHoursDay, place: Venue, exceptionalDay: Days) {
  const regular = place.openingHours.regular.find(item => item.dayOfWeek === exceptionalDay);
  return {
    opensHasChanged: override && regular && regular.opens !== override.opens,
    closesHasChanged: override && regular && regular.closes !== override.closes
  };
}

function exceptionalOpeningHours(dates: Date[], placesOpeningHours: PlacesOpeningHours): ExceptionalVenueHours[] {
  return [].concat.apply([], dates.reduce((acc, exceptionalDate) => {
    const exceptionalDay = london(exceptionalDate.overrideDate).format('dddd');
    const overrides = placesOpeningHours.map(place => {
      const override = place.openingHours.exceptional &&
      place.openingHours.exceptional.find(item => {
        if (item.overrideDate && exceptionalDate.overrideDate) {
          return london(item.overrideDate).format('YYYY-MM-DD') === london(exceptionalDate.overrideDate).format('YYYY-MM-DD');
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

function upcomingExceptionalOpeningPeriods(dates: ?(Moment)[][]) {
  return dates && dates.filter((dates) => {
    const displayPeriodStart = london().subtract(1, 'day');
    const displayPeriodEnd = london().add(15, 'day'); // TODO awaiting testing to inform display period
    return dates[0].overrideDate.clone().isBetween(displayPeriodStart, displayPeriodEnd) || dates[dates.length - 1].overrideDate.clone().isBetween(displayPeriodStart, displayPeriodEnd);
  });
}

function createRegularDay(day, venue) {
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

function exceptionalClosedDates(exceptionalOpeningHours) {
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

function parseVenuesToOpeningHours(doc: PrismicFragment): OpeningTimes {
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
  const futureExceptionalDates = exceptionalDates.filter(exceptionalDate => exceptionalDate.overrideDate && !isDatePast(exceptionalDate.overrideDate));
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
