// @flow
import moment from 'moment';
import {List} from 'immutable';

export function formatDate(date: Date): string {
  return moment(date).format('D MMMM YYYY');
}

export function formatDateTime(date: Date): string {
  return moment(date).format('D MMMM YYYY HH:mm');
}

export function formatTime(date: Date): string {
  return moment(date).format('HH:mm');
}

export function formatDayDate(date: Date): string {
  return moment(date).format('dddd D MMMM YYYY');
}

export function formatDateWithComingSoon(date: Date): string {
  const isFuture = moment().diff(date) < 0;
  return (isFuture ? 'Coming soon: ' : '') + formatDate(date);
}

function getRelativeTime({start, end}: {start: Date, end: Date}): {} {
  const momentNow = moment();
  const momentStart = moment(start);
  const momentEnd = moment(end);
  const momentWeekBeforeEnd = moment(end).subtract(7, 'd');
  const isFuture = momentStart.isAfter(momentNow);
  const isPast = momentEnd.isBefore(momentNow);
  const isLastWeek = momentNow.isBetween(momentWeekBeforeEnd, momentEnd);

  return {
    isFuture,
    isPast,
    isLastWeek
  };
}

export function formatDateRangeWithMessage({start, end}: {start: Date, end: Date}): string {
  const relativeTime = getRelativeTime({start, end});

  if (relativeTime.isFuture) {
    return 'Coming soon';
  } else if (relativeTime.isPast) {
    return 'Past exhibition';
  } else if (relativeTime.isLastWeek) {
    return 'Last chance';
  } else {
    return 'Current';
  }
}

export function formatDateRangeWithColor({start, end}: {start: Date, end: Date}): string {
  const relativeTime = getRelativeTime({start, end});

  return relativeTime.isPast ? 'red-graphics' : 'java';
}

export function formatAndDedupeOnDate(d1: Date, d2: Date): List<string> {
  return List([d1, d2]).map(formatDayDate).toSet().toList();
}

export function formatAndDedupeOnTime(d1: Date, d2: Date): List<string> {
  return List([d1, d2]).map(formatTime).toSet().toList();
}
