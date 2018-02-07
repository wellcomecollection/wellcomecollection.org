// @flow
import 'moment-timezone';
import moment from 'moment';
import {List} from 'immutable';

export function london(d: ?Date | ?string) {
  return moment.tz(d, 'Europe/London');
}

export function formatDate(date: Date): string {
  return london(date).format('D MMMM YYYY');
}

export function formatDateTime(date: Date): string {
  return london(date).format('D MMMM YYYY HH:mm');
}

export function formatTime(date: Date): string {
  return london(date).format('HH:mm');
}

export function formatDayDate(date: Date): string {
  return london(date).format('dddd D MMMM YYYY');
}

export function formatDay(date: Date): string {
  return london(date).format('dddd');
}

export function formatMonthYear(date: Date): string {
  return london(date).format('MMMM YYYY');
}

export function formatDateWithComingSoon(date: Date): string {
  const isFuture = london().diff(date) < 0;
  return (isFuture ? 'Coming soon: ' : '') + formatDate(date);
}

function getRelativeTime({start, end}: {start: Date, end: Date}): {} {
  const momentNow = london();
  const momentStart = london(start);
  const momentEnd = london(end);
  const momentOneWeekBeforeEnd = london(end).subtract(1, 'w');
  const isFuture = momentStart.isAfter(momentNow);
  const isPast = momentEnd.isBefore(momentNow);
  const isLastWeek = momentNow.isBetween(momentOneWeekBeforeEnd, momentEnd);

  return {
    isFuture,
    isPast,
    isLastWeek
  };
}

export function formatDateRangeWithMessage({start, end}: {start: Date, end: Date}): {text: string, color: string} {
  const relativeTime = getRelativeTime({start, end});

  if (end === null) {
    return {text: 'Ongoing', color: 'green'};
  } else if (relativeTime.isFuture) {
    return {text: 'Coming soon', color: 'marble'};
  } else if (relativeTime.isPast) {
    return {text: 'Past', color: 'marble'};
  } else if (relativeTime.isLastWeek) {
    return {text: 'Last week', color: 'orange'};
  } else {
    return {text: 'Current', color: 'green'};
  }
}

export function formatAndDedupeOnDate(d1: Date, d2: Date): List<string> {
  return List([d1, d2]).map(formatDayDate).toSet().toList();
}

export function formatAndDedupeOnTime(d1: Date, d2: Date): List<string> {
  return List([d1, d2]).map(formatTime).toSet().toList();
}

export function joinDateStrings(dateStrings: List<string>): string {
  return dateStrings.join('–');
}
