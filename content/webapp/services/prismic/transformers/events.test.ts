import { groupEventsBy } from '../../../services/prismic/events';
import { getLastEndTime } from './events';
import { data as uiEventData } from '../../../components/CardGrid/DailyTourPromo';
import { transformTimestamp } from '.';

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
    ...uiEventData,
    times: [
      {
        range: {
          startDateTime: new Date('2018-01-01'),
          endDateTime: new Date('2018-01-01'),
        },
        isFullyBooked: false,
      },
      {
        range: {
          startDateTime: new Date('2018-01-01'),
          endDateTime: new Date('2018-01-01'),
        },
        isFullyBooked: false,
      },
      {
        range: {
          startDateTime: new Date('2018-01-02'),
          endDateTime: new Date('2018-01-02'),
        },
        isFullyBooked: false,
      },
      {
        range: {
          startDateTime: new Date('2018-01-03'),
          endDateTime: new Date('2018-01-04'),
        },
        isFullyBooked: false,
      },
    ],
  },
  {
    ...uiEventData,
    times: [
      {
        range: {
          startDateTime: new Date('2018-01-06'),
          endDateTime: new Date('2018-01-07'),
        },
        isFullyBooked: false,
      },
    ],
  },
];
it('groups events by daterange', () => {
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

it('returns the last end time from the lastest date', () => {
  const lastEndTime = getLastEndTime(eventTimes);
  const expectedEndTime = transformTimestamp('2020-02-18T19:00:00+0000');
  expect(lastEndTime).toStrictEqual(expectedEndTime);
});
