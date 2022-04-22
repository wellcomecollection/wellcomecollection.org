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
            endDateTime: new Date(2100, 3, 25, 16, 30, 0),
          },
          isFullyBooked: false,
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

  // This is to account for events that have multiple dates.
  //
  // e.g. https://wellcomecollection.org/events/YjyVoREAACAAhUvk has two times:
  //
  //    - 22 April @ 15:00
  //    - 28 April @ 15:00
  //
  // If it's 23rd April, then the overall event is still "upcoming", even though one
  // of the times has passed.
  //
  it('includes an event as upcoming if _any_ of the times are in the future', () => {
    const events = [
      {
        id: '1',
        times: [
          {
            range: {
              startDateTime: new Date(2001, 3, 25, 16, 30, 0),
              endDateTime: new Date(2001, 3, 25, 17, 30),
            },
            isFullyBooked: false,
          },
          {
            range: {
              startDateTime: new Date(2100, 3, 25, 16, 30, 0),
              endDateTime: new Date(2100, 3, 25, 17, 30),
            },
            isFullyBooked: false,
          },
        ],
      },
    ];

    const upcomingEvents = getUpcomingEvents(events);

    expect(upcomingEvents.map(ev => ev.id)).toEqual(['1']);
  });
});
