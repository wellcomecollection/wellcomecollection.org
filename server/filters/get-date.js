// @flow
import moment from 'moment';

export default function getDate(date: Date): string {
  return moment(date).format('Do MMMM YYYY');
}
