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
          isFullyBooked: { inVenue: false, online: false },
        },
      ],
    }));

    const upcomingEvents = getUpcomingEvents(events);

    expect(upcomingEvents.map(ev => ev.id)).toEqual(['2100', '2200']);
  });

  it('sorts upcoming events by their start date', () => {
    const january = new Date(2100, 1, 1, 0, 0, 0);
    const february = new Date(2100, 2, 1, 0, 0, 0);
    const march = new Date(2100, 3, 1, 0, 0, 0);

    const events = [
      { id: 'jan', startDateTime: january },
      { id: 'mar', startDateTime: march },
      { id: 'feb', startDateTime: february },
    ].map(({ id, startDateTime }) => ({
      id,
      times: [
        {
          range: {
            startDateTime,
            endDateTime: new Date(2100, 3, 25, 16, 30, 0),
          },
          isFullyBooked: { inVenue: false, online: false },
        },
      ],
    }));

    const upcomingEvents = getUpcomingEvents(events);

    expect(upcomingEvents.map(ev => ev.id)).toEqual(['jan', 'feb', 'mar']);
  });

  it('includes an event as upcoming if a multi-day event hasn’t finished yet', () => {
    const pastDate = new Date(2001, 3, 25, 16, 30, 0);
    const futureDate = new Date(2100, 3, 25, 17, 30);

    const events = [
      {
        id: 'my-long-running-event',
        times: [
          {
            range: {
              startDateTime: pastDate,
              endDateTime: futureDate,
            },
            isFullyBooked: { inVenue: false, online: false },
          },
        ],
      },
    ];

    const upcomingEvents = getUpcomingEvents(events);

    expect(upcomingEvents.map(ev => ev.id)).toEqual(['my-long-running-event']);
  });
});
