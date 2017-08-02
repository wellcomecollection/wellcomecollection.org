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

export function formatAndDedupeOnDate(d1: Date, d2: Date): List<string> {
  return List([d1, d2]).map(formatDayDate).toSet().toList();
}

export function formatAndDedupeOnTime(d1: Date, d2: Date): List<string> {
  return List([d1, d2]).map(formatTime).toSet().toList();
}
