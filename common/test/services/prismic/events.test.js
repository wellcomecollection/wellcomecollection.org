// @flow
import {
  groupEventsBy,
  getLastEndTime,
} from '../../../services/prismic/events';
import { parseTimestamp } from '../../../services/prismic/parsers';

const eventTimes = [
  {
    startDateTime: '2020-02-16T11:00:00+0000',
    endDateTime: '2020-02-16T17:00:00+0000',
    isFullyBooked: null,
  },
  {
    startDateTime: '2020-02-18T11:00:00+0000',
    endDateTime: '2020-02-18T17:00:00+0000',
    isFullyBooked: null,
  },
  {
    startDateTime: '2020-02-18T13:00:00+0000',
    endDateTime: '2020-02-18T19:00:00+0000',
    isFullyBooked: null,
  },
  {
    startDateTime: '2020-02-15T11:00:00+0000',
    endDateTime: '2020-02-15T17:00:00+0000',
    isFullyBooked: null,
  },
];

const multiDayEvents = [
  {
    times: [
      {
        range: {
          startDateTime: new Date('2018-01-01'),
          endDateTime: new Date('2018-01-01'),
        },
      },
      {
        range: {
          startDateTime: new Date('2018-01-01'),
          endDateTime: new Date('2018-01-01'),
        },
      },
      {
        range: {
          startDateTime: new Date('2018-01-02'),
          endDateTime: new Date('2018-01-02'),
        },
      },
      {
        range: {
          startDateTime: new Date('2018-01-03'),
          endDateTime: new Date('2018-01-04'),
        },
      },
    ],
  },
  {
    times: [
      {
        range: {
          startDateTime: new Date('2018-01-06'),
          endDateTime: new Date('2018-01-07'),
        },
      },
    ],
  },
];
it('should group events by daterange', () => {
  // $FlowFixMe
  const eventsGroupedByDay = groupEventsBy(multiDayEvents, 'day');
  expect(eventsGroupedByDay.length).toBe(7);
  eventsGroupedByDay.forEach((eventsGroup, i) => {
    // Friday
    if (i === 4) {
      expect(eventsGroup.events.length).toBe(0);
    } else {
      expect(eventsGroup.events.length).toBe(1);
    }
  });
});

it('should return the last end time from the lastest date', () => {
  const lastEndTime = getLastEndTime(eventTimes);
  const expectedEndTime = parseTimestamp('2020-02-18T19:00:00+0000');
  expect(lastEndTime).toStrictEqual(expectedEndTime);
});
