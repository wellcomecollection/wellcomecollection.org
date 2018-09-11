// @flow
// $FlowFixMe
import 'moment-timezone';
import moment from 'moment';
import type Moment from 'moment';

export function london(d?: Date | string | Moment) {
  // $FlowFixMe
  return moment.tz(d, 'Europe/London');
}

export function formatDay(date: Date): string {
  return london(date).format('dddd');
}

export function formatDayDate(date: Date): string {
  return london(date).format('dddd D MMMM YYYY');
}

export function formatDate(date: Date | Moment): string {
  return london(date).format('D MMMM YYYY');
}

export function formatDateRange(date: Date): string {
  return london(date).format('D MMMM YYYY');
}

export function formatTime(date: Date): string {
  return london(date).format('HH:mm');
}

export function isTimePast(date: Date): boolean {
  const momentNow = london();
  const momentEnd = london(date);

  return momentEnd.isBefore(momentNow);
}

export function isDatePast(date: Date): boolean {
  const momentNow = london();
  const momentEnd = london(date);

  return momentEnd.isBefore(momentNow, 'day');
}

export function formatDateRangeWithMessage({start, end}: {start: Date, end: Date}): {text: string, color: string} {
  const now = london();
  const s = london(start);
  const e = london(end);

  if (s.isAfter(now, 'day')) {
    return {text: 'Coming soon', color: 'marble'};
  } else if (e.isBefore(now, 'day')) {
    return {text: 'Past', color: 'marble'};
  } else if (now.isBetween(e.clone().subtract(1, 'w'), e, 'day')) {
    return {text: 'Final week', color: 'orange'};
  } else {
    return {text: 'Now on', color: 'green'};
  }
}

export function formatAndDedupeOnDate(d1: Date, d2: Date): string[] {
  return Array.from(new Set([d1, d2].map(formatDayDate)));
}

export function formatAndDedupeOnTime(d1: Date, d2: Date): string[] {
  return Array.from(new Set([d1, d2].map(formatTime)));
}

export function joinDateStrings(dateStrings: string[]): string {
  return dateStrings.join('–');
};
