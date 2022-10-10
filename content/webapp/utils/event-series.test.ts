import { getUpcomingEvents } from './event-series';

describe('getUpcomingEvents', () => {
  it('picks out events that start after today', () => {
    const events = [
      { id: '2100', startDateTime: new Date(2100, 1, 1, 0, 0, 0) },
      { id: '2001', startDateTime: new Date(2001, 1, 1, 0, 0, 0) },
      { id: '2200', startDateTime: new Date(2200, 1, 1, 0, 0, 0) },
    ].map(({ id, startDateTime }) => ({
      id,
      times: [
        {
          range: {
            startDateTime,
            endDateTime: startDateTime,
          },
          isFullyBooked: false,
          onlineIsFullyBooked: false,
        },
      ],
    }));

    const upcomingEvents = getUpcomingEvents(events);

    expect(upcomingEvents.map(ev => ev.id)).toEqual(['2100', '2200']);
  });

  it('sorts upcoming events by their start date', () => {
    const events = [
      { id: '1', startDateTime: new Date(2100, 1, 1, 0, 0, 0) },
      { id: '3', startDateTime: new Date(2100, 3, 1, 0, 0, 0) },
      { id: '2', startDateTime: new Date(2100, 2, 1, 0, 0, 0) },
    ].map(({ id, startDateTime }) => ({
      id,
      times: [
        {
          range: {
            startDateTime,
            endDateTime: new Date(2100, 3, 25, 16, 30, 0),
          },
          isFullyBooked: false,
        },
      ],
    }));

    const upcomingEvents = getUpcomingEvents(events);

    expect(upcomingEvents.map(ev => ev.id)).toEqual(['1', '2', '3']);
  });

  it('includes an event as upcoming if a multi-day event hasn’t finished yet', () => {
    const events = [
      {
        id: 'YjyVoREAACAAhUvk',
        times: [
          {
            range: {
              startDateTime: new Date(2001, 3, 25, 16, 30, 0),
              endDateTime: new Date(2100, 3, 25, 17, 30),
            },
            isFullyBooked: false,
          },
        ],
      },
    ];

    const upcomingEvents = getUpcomingEvents(events);

    expect(upcomingEvents.map(ev => ev.id)).toEqual(['YjyVoREAACAAhUvk']);
  });
});
