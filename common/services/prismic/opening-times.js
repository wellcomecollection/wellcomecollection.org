// @flow
import Prismic from 'prismic-javascript';
import {getDocuments} from './api';
import {isDatePast, london} from '../../utils/format-date';
import groupBy from 'lodash.groupby';
import type {ExceptionalVenueHours, PlacesOpeningHours, ExceptionalOpeningHoursDay, Venue, Days, OpeningTimes} from '../../model/opening-hours';
import type {PrismicFragment} from '../../services/prismic/types';
import type Moment from 'moment';

export async function getCollectionOpeningTimes() {
  const collectionVenues = await getDocuments(null, [Prismic.Predicates.any('document.type', ['collection-venue'])], {});
  return parseVenuesToOpeningHours(collectionVenues);
}

function exceptionalOpeningDates(placesHoursArray: PlacesOpeningHours) {
  return [].concat.apply([], placesHoursArray.map(place => { // [].concat.apply to flatten the array
    return place.openingHours.exceptional &&
      place.openingHours.exceptional.map(exceptionalDate => exceptionalDate.overrideDate);
  }))
    .filter(Boolean)
    .sort((a, b) => Number(a) - Number(b))
    .filter((item, i, array) => {
      const firstDate = item;
      const prevDate = array[i - 1];
      if (!i) {
        return true;
      } else if ((firstDate && firstDate.toDate() instanceof Date) && (prevDate && prevDate.toDate() instanceof Date)) {
        return london(firstDate).format('YYYY-MM-DD') !== london(prevDate).format('YYYY-MM-DD');
      }
    });
};

function exceptionalOpeningPeriods(dates: Moment[]) {
  let groupedIndex = 0;

  return dates.reduce((acc, date, i, array) => {
    const previousDate = array[i - 1] ? array[i - 1] : null;

    if (!previousDate) {
      acc[groupedIndex] = [];
      acc[groupedIndex].push(date);
    } else if (previousDate && date.isBefore(previousDate.clone().add(4, 'days'))) {
      acc[groupedIndex].push(date);
    } else {
      groupedIndex++;
      acc[groupedIndex] = [];
      acc[groupedIndex].push(date);
    }

    return acc;
  }, []);
}

export function exceptionalOpeningPeriodsAllDates(exceptionalOpeningPeriods: Date[][], london: (a: Date) => void) {
  return exceptionalOpeningPeriods.map((periodDateArray) => {
    const startDate = london(periodDateArray[0]).startOf('day');
    const lastDate = london(periodDateArray[periodDateArray.length - 1]).startOf('day');
    const completeDateArray = [];
    while (startDate.startOf('day').isSameOrBefore(lastDate)) {
      const current = startDate.format('YYYY-MM-DD');
      completeDateArray.push(new Date(current));
      startDate.add(1, 'day');
    }
    return completeDateArray;
  });
}

function regularTimesbyDay(placesOpeningHours: PlacesOpeningHours, currentDate: Date, london: (a: Date) => void) {
  const currentDay = london(currentDate).format('dddd');
  return placesOpeningHours.map((place) => {
    const hours = place.openingHours.regular.find(hours => hours.dayOfWeek === currentDay);
    return  {
      exceptionalDate: currentDate,
      exceptionalDay: currentDay,
      id: place.id,
      name: place.name,
      openingHours: {
        overrideDate: currentDate,
        dayOfWeek: currentDay,
        opens: hours && hours.opens,
        closes: hours && hours.closes,
        note: hours && hours.note
      }
    };
  });
}

// TODO object
export function exceptionalOpeningHoursByPeriod(upcomingPeriodsComplete: Date[][], exceptionalHoursByDate: {}, london, placesOpeningHours: PlacesOpeningHours) {
  return upcomingPeriodsComplete.map((period) => {
    const periodStart = period[0];
    const periodEnd = period[period.length - 1];
    const dates = period && period.map((periodDate) => {
      const current = london(periodDate).format('YYYY-MM-DD');
      const hours = exceptionalHoursByDate[current];
      if (hours) {
        return hours;
      } else {
        return regularTimesbyDay(placesOpeningHours, periodDate, london);
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
    const exceptionalDay = london(exceptionalDate).format('dddd');
    const overrides = placesOpeningHours.map(place => {
      const override = place.openingHours.exceptional &&
      place.openingHours.exceptional.find(item => {
        if (item.overrideDate && exceptionalDate) {
          return london(item.overrideDate).format('dd-mm-yyyy') === london(exceptionalDate).format('dd-mm-yyyy');
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
    const displayPeriodEnd = london().add(15, 'day');
    return dates[0].clone().isBetween(displayPeriodStart, displayPeriodEnd) || dates[dates.length - 1].clone().isBetween(displayPeriodStart, displayPeriodEnd);
  });
}

function createExceptionalDate(day, venue) {
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
      dayOfWeek: day
    };
  }
}

function parseVenuesToOpeningHours(doc: PrismicFragment): OpeningTimes {
  const placesOpeningHours =  doc.results.map((venue) => {
    const exceptionalOpeningHours = venue.data.modifiedDayOpeningTimes.map((modified) => {
      const start = modified.startDateTime && london(modified.startDateTime).format('HH:mm');
      const end = modified.startDateTime && london(modified.endDateTime).format('HH:mm');
      const overrideDate = modified.overrideDate && london(modified.overrideDate);
      return {
        overrideDate,
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
          createExceptionalDate('Monday', venue),
          createExceptionalDate('Tuesday', venue),
          createExceptionalDate('Wednesday', venue),
          createExceptionalDate('Thursday', venue),
          createExceptionalDate('Friday', venue),
          createExceptionalDate('Saturday', venue),
          createExceptionalDate('Sunday', venue)
        ],
        exceptional: exceptionalOpeningHours
      }
    };
  });

  const exceptionalDates = exceptionalOpeningDates(placesOpeningHours);
  const futureExceptionalDates = exceptionalDates.filter(exceptionalDate => exceptionalDate && !isDatePast(exceptionalDate));
  const exceptionalPeriods = exceptionalOpeningPeriods(futureExceptionalDates);
  const individualExceptionalOpeningHours = exceptionalOpeningHours(futureExceptionalDates, placesOpeningHours);
  const exceptionalHours = groupBy(individualExceptionalOpeningHours, item => london(item.exceptionalDate).format('YYYY-MM-DD'));
  const orderedHours = {};
  Object.keys(exceptionalHours).sort().forEach(key => orderedHours[key] = exceptionalHours[key]);
  return {
    placesOpeningHours: placesOpeningHours.sort((a, b) => {
      return a.order - b.order;
    }),
    upcomingExceptionalOpeningPeriods: exceptionalOpeningPeriodsAllDates(upcomingExceptionalOpeningPeriods(exceptionalPeriods), london),
    exceptionalOpeningHours: exceptionalOpeningHoursByPeriod(exceptionalOpeningPeriodsAllDates(exceptionalPeriods, london), orderedHours, london, placesOpeningHours)
  };
}
