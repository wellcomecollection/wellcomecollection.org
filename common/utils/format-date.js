// @flow
import 'moment-timezone';
import moment from 'moment';

export function london(d: ?Date | ?string) {
  return moment.tz(d, 'Europe/London');
}

export function formatDate(date: Date): string {
  return london(date).format('D MMMM YYYY');
}

