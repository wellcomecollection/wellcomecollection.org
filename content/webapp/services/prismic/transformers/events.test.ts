import { groupEventsByDay } from '../../../services/prismic/events';
import { getLastEndTime, getEventbriteId } from './events';
import { data as uiEventData } from '../../../components/CardGrid/DailyTourPromo';
import { EventTime } from '../../../types/events';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';

const eventTimes: EventTime[] = [
  {
    range: {
      startDateTime: new Date('2020-02-16T11:00:00+0000'),
      endDateTime: new Date('2020-02-16T17:00:00+0000'),
    },
    isFullyBooked: false,
  },
  {
    range: {
      startDateTime: new Date('2020-02-18T11:00:00+0000'),
      endDateTime: new Date('2020-02-18T17:00:00+0000'),
    },
    isFullyBooked: false,
  },
  {
    range: {
      startDateTime: new Date('2020-02-18T13:00:00+0000'),
      endDateTime: new Date('2020-02-18T19:00:00+0000'),
    },
    isFullyBooked: false,
  },
  {
    range: {
      startDateTime: new Date('2020-02-15T11:00:00+0000'),
      endDateTime: new Date('2020-02-15T17:00:00+0000'),
    },
    isFullyBooked: false,
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

describe('Events', () => {
  it('groups events by daterange', () => {
    const eventsGroupedByDay = groupEventsByDay(multiDayEvents);
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

  it('gets Eventbrite IDs from embed URLs', () => {
    const embedUrl1 =
      'https://www.eventbrite.com/e/test-event-1-tickets-5398972389';
    const embedUrl2 = 'https://www.eventbrite.com/e/5398972389';
    const embedUrl3 = 'https://www.eventbrite.com';

    expect(getEventbriteId(embedUrl1)).toBe('test-event-1-tickets-5398972389');
    expect(getEventbriteId(embedUrl2)).toBe('5398972389');
    expect(getEventbriteId(embedUrl3)).toBeUndefined();
  });
});
