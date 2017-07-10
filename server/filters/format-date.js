// @flow
import moment from 'moment';

export function formatDate(date: Date): string {
  return moment(date).format('D MMMM YYYY');
}

export function formatDateTime(date: Date): string {
  return moment(date).format('D MMMM YYYY HH:mm');
}

export function formatDateWithComingSoon(date: Date): string {
  const isFuture = moment().diff(date) < 0;
  return (isFuture ? 'Coming soon: ' : '') + formatDate(date);
}
