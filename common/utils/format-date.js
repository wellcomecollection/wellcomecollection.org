// @flow
// $FlowFixMe
import 'moment-timezone';
import moment from 'moment';

export function london(d?: Date | string) {
  // $FlowFixMe
  return moment.tz(d, 'Europe/London');
}

export function formatDayDate(date: Date): string {
  return london(date).format('dddd D MMMM YYYY');
}

export function formatDate(date: Date): string {
  return london(date).format('D MMMM YYYY');
}

export function formatTime(date: Date): string {
  return london(date).format('HH:mm');
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

  if (s.isAfter(now)) {
    return {text: 'Coming soon', color: 'marble'};
  } else if (e.isBefore(now)) {
    return {text: 'Past', color: 'marble'};
  } else if (now.isBetween(e.subtract(1, 'w'), e)) {
    return {text: 'Final week', color: 'orange'};
  } else {
    return {text: 'Now on', color: 'green'};
  }
}
