// @flow
// $FlowFixMe
import 'moment-timezone';
import moment from 'moment';

export function london(d: ?Date | ?string) {
  // $FlowFixMe
  return moment.tz(d, 'Europe/London');
}

export function formatDate(date: Date): string {
  return london(date).format('D MMMM YYYY');
}

export function formatTime(date: Date): string {
  console.log(london(date).format('HH:mm'));
  return london(date).format('HH:mm');
}
