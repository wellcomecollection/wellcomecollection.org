// @flow
import 'moment-timezone';
import moment from 'moment';
import {List} from 'immutable';

function london(d) {
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

export function formatDateWithComingSoon(date: Date): string {
  const isFuture = london().diff(date) < 0;
  return (isFuture ? 'Coming soon: ' : '') + formatDate(date);
}

function getRelativeTime({start, end}: {start: Date, end: Date}): {} {
  const momentNow = london();
  const momentStart = london(start);
  const momentEnd = london(end);
  const momentThreeWeeksBeforeEnd = london(end).subtract(3, 'w');
  const isFuture = momentStart.isAfter(momentNow);
  const isPast = momentEnd.isBefore(momentNow);
  const isFinalWeeks = momentNow.isBetween(momentThreeWeeksBeforeEnd, momentEnd);

  return {
    isFuture,
    isPast,
    isFinalWeeks
  };
}

export function formatDateRangeWithMessage({start, end}: {start: Date, end: Date}): {text: string, color: string} {
  const relativeTime = getRelativeTime({start, end});

  if (end === null) {
    return {text: 'Permanent exhibition', color: 'mint'};
  } else if (relativeTime.isFuture) {
    return {text: 'Coming soon', color: 'cotton-seed'};
  } else if (relativeTime.isPast) {
    return {text: 'Past exhibition', color: 'cotton-seed'};
  } else if (relativeTime.isFinalWeeks) {
    return {text: 'Final weeks', color: 'orange-graphics'};
  } else {
    return {text: 'Current exhibition', color: 'mint'};
  }
}

export function formatAndDedupeOnDate(d1: Date, d2: Date): List<string> {
  return List([d1, d2]).map(formatDayDate).toSet().toList();
}

export function formatAndDedupeOnTime(d1: Date, d2: Date): List<string> {
  return List([d1, d2]).map(formatTime).toSet().toList();
}

export function joinDateStrings(dateStrings: List<string>): string {
  return dateStrings.join(' – ');
}
