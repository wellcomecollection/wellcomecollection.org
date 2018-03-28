// @flow
// $FlowFixMe
import 'moment-timezone';
import moment from 'moment';

export function london(d: ?Date | ?string) {
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

  return momentEnd.isBefore(momentNow);
}
