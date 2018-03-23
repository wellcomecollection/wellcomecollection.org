// @flow
// $FlowFixMe
import 'moment-timezone';
import moment from 'moment';

export function london(d: ?Date | ?string) {
  // $FlowFixMe
  return moment.tz(d, 'Europe/London');
}

export function formatDayDate(date: ?Date | ?string): string {
  return london(date).format('dddd D MMMM YYYY');
}

export function formatDate(date: Date | ?string): string {
  return london(date).format('D MMMM YYYY');
}

export function formatTime(date: Date | ?string): string {
  return london(date).format('HH:mm');
}
