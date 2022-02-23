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
