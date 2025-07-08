import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { groupEventsByDay } from '@weco/content/services/prismic/events';
import { EventTime } from '@weco/content/types/events';
import { data as uiEventData } from '@weco/content/views/components/CardGrid/CardGrid.DailyTourPromo';

import {
  getEventbriteId,
  getLastEndTime,
  transformEventBasicTimes,
} from './events';

const eventTimes: EventTime[] = [
  {
    range: {
      startDateTime: new Date('2020-02-16T11:00:00+0000'),
      endDateTime: new Date('2020-02-16T17:00:00+0000'),
    },
    isFullyBooked: { inVenue: false, online: false },
  },
  {
    range: {
      startDateTime: new Date('2020-02-18T11:00:00+0000'),
      endDateTime: new Date('2020-02-18T17:00:00+0000'),
    },
    isFullyBooked: { inVenue: false, online: false },
  },
  {
    range: {
      startDateTime: new Date('2020-02-18T13:00:00+0000'),
      endDateTime: new Date('2020-02-18T19:00:00+0000'),
    },
    isFullyBooked: { inVenue: false, online: false },
  },
  {
    range: {
      startDateTime: new Date('2020-02-15T11:00:00+0000'),
      endDateTime: new Date('2020-02-15T17:00:00+0000'),
    },
    isFullyBooked: { inVenue: false, online: false },
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
        isFullyBooked: { inVenue: false, online: false },
      },
      {
        range: {
          startDateTime: new Date('2018-01-01'),
          endDateTime: new Date('2018-01-01'),
        },
        isFullyBooked: { inVenue: false, online: false },
      },
      {
        range: {
          startDateTime: new Date('2018-01-02'),
          endDateTime: new Date('2018-01-02'),
        },
        isFullyBooked: { inVenue: false, online: false },
      },
      {
        range: {
          startDateTime: new Date('2018-01-03'),
          endDateTime: new Date('2018-01-04'),
        },
        isFullyBooked: { inVenue: false, online: false },
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
        isFullyBooked: { inVenue: false, online: false },
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

  it('gets Eventbrite IDs from embed URLs and adds the "aff" parameter', () => {
    const embedUrl1 =
      'https://www.eventbrite.com/e/test-event-1-tickets-5398972389';
    const embedUrl2 = 'https://www.eventbrite.com/e/5398972389';
    const embedUrl3 =
      'https://www.eventbrite.com/e/5398972389?aff=oddtdtcreator';
    const embedUrl4 = 'https://www.eventbrite.com';

    expect(getEventbriteId(embedUrl1)).toBe(
      'test-event-1-tickets-5398972389?aff=WCWebsitelink'
    );
    expect(getEventbriteId(embedUrl2)).toBe('5398972389?aff=WCWebsitelink');
    expect(getEventbriteId(embedUrl3)).toBe('5398972389?aff=WCWebsitelink');
    expect(getEventbriteId(embedUrl4)).toBeUndefined();
  });
});

describe('transformEventBasicTimes', () => {
  it('returns the event summary times for an event with no schedule', () => {
    // This is based on https://wellcomecollection.org/events/Y1EkyhEAAA1CDSYH
    //
    // This is an event that occurred once, on a single evening.
    const summaryTimes: EventTime[] = [
      {
        range: {
          startDateTime: new Date('2022-11-25T19:00:00.000Z'),
          endDateTime: new Date('2022-11-25T20:30:00.000Z'),
        },
        isFullyBooked: { inVenue: false, online: false },
      },
    ];
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const document: any = {
      /* eslint-enable @typescript-eslint/no-explicit-any */
      data: {
        schedule: [{ event: { link_type: 'Document' }, isNotLinked: null }],
      },
    };

    expect(transformEventBasicTimes(summaryTimes, document)).toBe(summaryTimes);
  });

  it('returns the event summary times for a multi-day festival', () => {
    // This is based on https://wellcomecollection.org/events/XU1-9BMAACMAjCIb
    //
    // This is an event that ran over four days, with an individually scheduled item
    // on each day.
    const summaryTimes: EventTime[] = [
      {
        range: {
          startDateTime: new Date('2019-10-16T23:00:00.000Z'),
          endDateTime: new Date('2019-10-19T23:00:00.000Z'),
        },
        isFullyBooked: { inVenue: false, online: false },
      },
    ];
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const document: any = {
      /* eslint-enable @typescript-eslint/no-explicit-any */
      data: {
        schedule: [
          {
            event: {
              id: 'oct-17',
              data: {
                times: [
                  {
                    startDateTime: '2019-10-17T18:00:00+0000',
                    endDateTime: '2019-10-17T19:30:00+0000',
                  },
                ],
              },
              link_type: 'Document',
              isBroken: false,
            },
          },
          {
            event: {
              id: 'oct-18',
              data: {
                times: [
                  {
                    startDateTime: '2019-10-18T14:00:00+0000',
                    endDateTime: '2019-10-18T15:00:00+0000',
                  },
                ],
              },
              link_type: 'Document',
              isBroken: false,
            },
          },
          {
            event: {
              id: 'oct-20',
              data: {
                times: [
                  {
                    startDateTime: '2019-10-20T14:00:00+0000',
                    endDateTime: '2019-10-20T15:00:00+0000',
                  },
                ],
              },
              link_type: 'Document',
              isBroken: false,
            },
          },
          {
            event: {
              id: 'oct-19',
              data: {
                times: [
                  {
                    startDateTime: '2019-10-19T13:00:00+0000',
                    endDateTime: '2019-10-19T15:00:00+0000',
                  },
                ],
              },
              link_type: 'Document',
              isBroken: false,
            },
          },
        ],
      },
    };

    expect(transformEventBasicTimes(summaryTimes, document)).toBe(summaryTimes);
  });

  it('uses the scheduled item times for a repeating event', () => {
    // This is based on https://wellcomecollection.org/events/YzGDAxEAAM-gfxhj
    //
    // This is an event that was repeated on seven different days over four months.
    const summaryTimes: EventTime[] = [
      {
        range: {
          startDateTime: new Date('2022-11-03T16:00:00.000Z'),
          endDateTime: new Date('2023-02-09T20:00:00.000Z'),
        },
        isFullyBooked: { inVenue: false, online: false },
      },
    ];

    const scheduleItemNov3 = {
      startDateTime: '2022-11-03T16:00:00+0000',
      endDateTime: '2022-11-03T20:00:00+0000',
      isFullyBooked: null,
      onlineIsFullyBooked: null,
    };
    const scheduleItemNov15 = {
      startDateTime: '2022-11-15T10:00:00+0000',
      endDateTime: '2022-11-15T14:00:00+0000',
      isFullyBooked: null,
      onlineIsFullyBooked: null,
    };
    const scheduleItemDec3 = {
      startDateTime: '2022-12-03T14:00:00+0000',
      endDateTime: '2022-12-03T18:00:00+0000',
      isFullyBooked: null,
      onlineIsFullyBooked: null,
    };
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const document: any = {
      /* eslint-enable @typescript-eslint/no-explicit-any */
      data: {
        schedule: [
          {
            event: {
              id: 'nov-3',
              data: {
                times: [scheduleItemNov3],
              },
              link_type: 'Document',
              isBroken: false,
            },
          },
          {
            event: {
              id: 'nov-15',
              data: {
                times: [scheduleItemNov15],
              },
              link_type: 'Document',
              isBroken: false,
            },
          },
          {
            event: {
              id: 'dec-3',
              data: {
                times: [scheduleItemDec3],
              },
              link_type: 'Document',
              isBroken: false,
            },
          },
        ],
      },
    };

    expect(transformEventBasicTimes(summaryTimes, document)).toStrictEqual([
      {
        range: {
          startDateTime: new Date('2022-11-03T16:00:00+0000'),
          endDateTime: new Date('2022-11-03T20:00:00+0000'),
        },
        isFullyBooked: {
          inVenue: null,
          online: null,
        },
      },
      {
        range: {
          startDateTime: new Date('2022-11-15T10:00:00+0000'),
          endDateTime: new Date('2022-11-15T14:00:00+0000'),
        },
        isFullyBooked: {
          inVenue: null,
          online: null,
        },
      },
      {
        range: {
          startDateTime: new Date('2022-12-03T14:00:00+0000'),
          endDateTime: new Date('2022-12-03T18:00:00+0000'),
        },
        isFullyBooked: {
          inVenue: null,
          online: null,
        },
      },
    ]);
  });
});
