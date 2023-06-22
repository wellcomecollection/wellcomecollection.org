import { HasTimes } from '@weco/content/types/events';
import { getUpcomingEvents, isUpcoming } from './event-series';
import * as dateUtils from '@weco/common/utils/dates';

function createEvent({
  startDateTime,
  endDateTime,
}: {
  startDateTime: Date;
  endDateTime: Date;
}): HasTimes {
  return {
    times: [
      {
        range: {
          startDateTime,
          endDateTime,
        },
        isFullyBooked: { inVenue: false, online: false },
      },
    ],
  };
}

describe('isUpcoming', () => {
  const mondayAt7am = new Date('2007-01-01T07:00:00Z');
  const mondayAt9am = new Date('2007-01-01T09:00:00Z');
  const mondayAt11am = new Date('2007-01-01T11:00:00Z');

  const tuesdayAt7am = new Date('2007-01-02T07:00:00Z');

  it('an event which finished in the past is not upcoming', () => {
    const event = createEvent({
      startDateTime: new Date(2001, 1, 1, 1, 1, 1),
      endDateTime: new Date(2002, 1, 1, 1, 1, 1),
    });

    expect(isUpcoming(event)).toBeFalsy();
  });

  it('an event which started earlier today and hasn’t finished yet is upcoming', () => {
    jest
      .spyOn(dateUtils, 'isFuture')
      .mockImplementation((d: Date) => d > mondayAt9am);

    const event = createEvent({
      startDateTime: mondayAt7am,
      endDateTime: mondayAt11am,
    });

    expect(isUpcoming(event)).toBeTruthy();
  });

  it('an event which started earlier today and is already finished is past', () => {
    jest
      .spyOn(dateUtils, 'isFuture')
      .mockImplementation((d: Date) => d > mondayAt11am);

    const event = createEvent({
      startDateTime: mondayAt7am,
      endDateTime: mondayAt9am,
    });

    expect(isUpcoming(event)).toBeFalsy();
  });

  it('an event which started earlier today and finishes tomorrow is upcoming', () => {
    jest
      .spyOn(dateUtils, 'isFuture')
      .mockImplementation((d: Date) => d > mondayAt9am);

    const event = createEvent({
      startDateTime: mondayAt7am,
      endDateTime: tuesdayAt7am,
    });

    expect(isUpcoming(event)).toBeTruthy();
  });
});

describe('getUpcomingEvents', () => {
  it('picks out events that start after today', () => {
    const events = [
      { id: '2100', startDateTime: new Date(2100, 1, 1, 0, 0, 0) },
      { id: '2001', startDateTime: new Date(2001, 1, 1, 0, 0, 0) },
      { id: '2200', startDateTime: new Date(2200, 1, 1, 0, 0, 0) },
    ].map(({ id, startDateTime }) => ({
      id,
      ...createEvent({ startDateTime, endDateTime: startDateTime }),
    }));

    const upcomingEvents = getUpcomingEvents(events);

    expect(upcomingEvents.map(ev => ev.id)).toEqual(['2100', '2200']);
  });

  it('sorts upcoming events by their start date', () => {
    const january = new Date(2100, 1, 1, 0, 0, 0);
    const february = new Date(2100, 2, 1, 0, 0, 0);
    const march = new Date(2100, 3, 1, 0, 0, 0);
    const april = new Date(2100, 4, 1, 0, 0, 0);

    const events = [
      { id: 'jan', startDateTime: january },
      { id: 'mar', startDateTime: march },
      { id: 'feb', startDateTime: february },
    ].map(({ id, startDateTime }) => ({
      id,
      ...createEvent({ startDateTime, endDateTime: april }),
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
        ...createEvent({ startDateTime: pastDate, endDateTime: futureDate }),
      },
    ];

    const upcomingEvents = getUpcomingEvents(events);

    expect(upcomingEvents.map(ev => ev.id)).toEqual(['my-long-running-event']);
  });
});
