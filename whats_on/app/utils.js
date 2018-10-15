// @flow
import {london} from '@weco/common/utils/format-date';
import {getTodaysGalleriesHours} from '@weco/common/utils/get-todays-galleries-hours';
import type {Period} from '@weco/common/model/periods';

export function getListHeader(collectionOpeningTimes: any) {
  console.info(collectionOpeningTimes);
  const galleriesOpeningTimes = collectionOpeningTimes.placesOpeningHours && collectionOpeningTimes.placesOpeningHours.find(venue => venue.name === 'Galleries').openingHours;
  return {
    todayOpeningHours: getTodaysGalleriesHours(galleriesOpeningTimes),
    name: 'What\'s on',
    items: [
      {
        id: 'everything',
        title: 'Everything',
        url: `/whats-on`
      },
      {
        id: 'today',
        title: 'Today',
        url: `/whats-on/today`
      },
      {
        id: 'the-weekend',
        title: 'This weekend',
        url: `/whats-on/the-weekend`
      }
    ]
  };
}

export function getMomentsForPeriod(period: Period) {
  const todaysDate = london();
  const todaysDatePlusSix = todaysDate.clone().add(6, 'days');

  switch (period) {
    case 'today': return [todaysDate.startOf('day'), todaysDate.endOf('day')];
    case 'this-weekend': return [getWeekendFromDate(todaysDate), getWeekendToDate(todaysDate)];
    // FIXME: this isn't really 'this week', but the 'next seven days' (needs UX/content rethink?)
    case 'this-week': return [todaysDate.startOf('day'), todaysDatePlusSix.endOf('day')];
    default: return [todaysDate.startOf('day'), undefined];
  }
}

function getWeekendFromDate(today) {
  const todayInteger = today.day(); // day() return Sun as 0, Sat as 6
  if (todayInteger !== 0) {
    return london(today).day(5);
  } else {
    return london(today).day(-2);
  }
}

function getWeekendToDate(today) {
  const todayInteger = today.day(); // day() return Sun as 0, Sat as 6
  if (todayInteger === 0) {
    return london(today);
  } else {
    return london(today).day(7);
  }
}
