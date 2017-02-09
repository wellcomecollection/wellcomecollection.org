// @flow
import moment from 'moment';

export default function formatDate(date: Date): string {
  return moment(date).fromNow();
}
