// @flow
import moment from 'moment';

export default function getDays(date: Date): string {
  return moment(date).fromNow();
}
