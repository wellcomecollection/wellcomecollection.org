import { getUpcomingEvents } from './event-series';

describe('getUpcomingEvents', () => {
  it('picks out events that start after today', () => {
    const events = [
      {
        id: '2100',
        times: [
          {
            range: {
              startDateTime: new Date(2100, 3, 25, 15, 30, 0),
              endDateTime: new Date(2100, 3, 25, 16, 30, 0),
            },
            isFullyBooked: false,
          },
        ],
      },
      {
        id: '2001',
        times: [
          {
            range: {
              startDateTime: new Date(2001, 3, 25, 15, 30, 0),
              endDateTime: new Date(2001, 3, 25, 16, 30, 0),
            },
            isFullyBooked: false,
          },
        ],
      },
      {
        id: '2200',
        times: [
          {
            range: {
              startDateTime: new Date(2200, 3, 25, 15, 30, 0),
              endDateTime: new Date(2200, 3, 25, 16, 30, 0),
            },
            isFullyBooked: false,
          },
        ],
      },
    ];

    const upcomingEvents = getUpcomingEvents(events);

    expect(upcomingEvents.map(ev => ev.id)).toEqual(['2100', '2200']);
  });
});
