// @flow
import type { EventTime } from '../../model/events';
import type { PrismicDocument } from './types';
import moment from 'moment';
import {
  isDocumentLink,
  parseTimestamp,
} from './parsers';
import isEmptyObj from '../../utils/is-empty-object';
// $FlowFixMe
import { london } from '../../utils/format-date';

export function determineDateRange(
  times: {
    startDateTime: string,
    endDateTime: string,
    isFullyBooked: ?boolean,
  }[]
) {
  const startTimes = times
    .map(eventTime => {
      return london(eventTime.startDateTime);
    })
    .sort((a, b) => b.isBefore(a, 'day'));
  const endTimes = times
    .map(eventTime => {
      return london(eventTime.endDateTime);
    })
    .sort((a, b) => b.isBefore(a, 'day'));
  return {
    firstDate: startTimes[0],
    lastDate: endTimes[endTimes.length - 1],
    repeats: times.length,
  };
}

export function getLastEndTime(
  times: {
    startDateTime: string,
    endDateTime: string,
    isFullyBooked: ?boolean,
  }[]
) {
  return times
    .sort((x, y) => moment(y.endDateTime).unix() - moment(x.endDateTime).unix())
    .map(time => {
      return parseTimestamp(time.endDateTime);
    })[0];
}
