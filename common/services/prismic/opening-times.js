import Prismic from 'prismic-javascript';
import {getMemoizedPrismicApi} from './api';
import {isDatePast, london} from '../../utils/format-date';
import groupBy from 'lodash.groupby';
import type {ExceptionalVenueHours, PlacesOpeningHours, ExceptionalOpeningHoursDay, Venue, Days} from '../../model/opening-hours';

export async function getCollectionOpeningTimes() {
  const prismic = await getMemoizedPrismicApi();
  const collectionVenues = await prismic.query([
    Prismic.Predicates.any('document.type', ['collection-venue'])
  ]);

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

function exceptionalOpeningPeriods(dates: PlacesOpeningHours) {
  let groupedIndex = 0;

  return dates.reduce((acc, date, i, array) => {
    const currentDate = london(date);
    const previousDate = array[i - 1] ? array[i - 1] : null;

    if (!previousDate) {
      acc[groupedIndex] = [];
      acc[groupedIndex].push(date);
    } else if (previousDate && currentDate.isBefore(london(previousDate).add(4, 'days'))) {
      acc[groupedIndex].push(date);
    } else {
      groupedIndex++;
      acc[groupedIndex] = [];
      acc[groupedIndex].push(date);
    }

    return acc;
  }, []);
}

function identifyChanges(override: ?ExceptionalOpeningHoursDay, place: Venue, exceptionalDay: Days) {
  const regular = place.openingHours.regular.find(item => item.dayOfWeek === exceptionalDay);
  return {
    opensHasChanged: override && regular && regular.opens !== override.opens,
    closesHasChanged: override && regular && regular.closes !== override.closes
  };
}

function exceptionalOpeningHours(dates: Date[], placesOpeningHours: PlacesOpeningHours, order: {}): ExceptionalVenueHours[] {
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

function upcomingExceptionalOpeningPeriods(dates: Date[][]) {
  return dates && dates.filter((dates) => {
    const displayPeriodStart = london().subtract(1, 'day');
    const displayPeriodEnd = london().add(15, 'day');
    return london(dates[0]).isBetween(displayPeriodStart, displayPeriodEnd) || london(dates[dates.length - 1]).isBetween(displayPeriodStart, displayPeriodEnd);
  });
}

function createExceptionalDate(day, venue) {
  const capitalizedDay = day[0].toUpperCase() + day.slice(1);
  const lowercaseDay = day.toLowerCase();
  const start = venue.data[lowercaseDay][0].startDateTime;
  const end = venue.data[lowercaseDay][0].endDateTime;
  if (start && end) {
    return {
      dayOfWeek: capitalizedDay,
      opens: london(start).format('HH:mm'),
      closes: london(end).format('HH:mm')
    };
  } else {
    return {
      dayOfWeek: capitalizedDay
    };
  }
}

function parseVenuesToOpeningHours(doc: PrismicDoc): PlacesOpeningHours {
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
          createExceptionalDate('monday', venue),
          createExceptionalDate('tuesday', venue),
          createExceptionalDate('wednesday', venue),
          createExceptionalDate('thursday', venue),
          createExceptionalDate('friday', venue),
          createExceptionalDate('saturday', venue),
          createExceptionalDate('sunday', venue)
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
    upcomingExceptionalOpeningPeriods: upcomingExceptionalOpeningPeriods(exceptionalPeriods),
    exceptionalOpeningHours: orderedHours
  };
}
