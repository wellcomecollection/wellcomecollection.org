import {
  groupEventsByDay,
  orderEventsByNextAvailableDate,
  upcomingDatesFullyBooked,
} from './events';
import * as dateUtils from '@weco/common/utils/dates';

describe('orderEventsByNextAvailableDate', () => {
  it('returns events in the right order', () => {
    const aprilEvent = {
      id: 'April-YjhVlhEAACEAcYb1',
      times: [
        {
          range: {
            startDateTime: new Date(2032, 3, 25, 15, 30, 0),
            endDateTime: new Date(2032, 3, 25, 16, 30, 0),
          },
          isFullyBooked: { inVenue: false, online: false },
        },
      ],
    };

    const marchEvent = {
      id: 'March-YhTyEhMAADOEddAT',
      times: [
        {
          range: {
            startDateTime: new Date(2032, 2, 24, 18, 0, 0),
            endDateTime: new Date(2032, 2, 25, 19, 30, 0),
          },
          isFullyBooked: { inVenue: false, online: false },
        },
      ],
    };

    const result = orderEventsByNextAvailableDate([aprilEvent, marchEvent]);
    expect(result).toEqual([marchEvent, aprilEvent]);
  });

  it('includes multi-day festivals that are midway through their run', () => {
    const evWhatYouSee = {
      times: [
        {
          range: {
            startDateTime: new Date('2022-11-17T18:30:00.000Z'),
            endDateTime: new Date('2022-11-19T15:00:00.000Z'),
          },
          isFullyBooked: { inVenue: false, online: false },
        },
      ],
      title: 'What You See / Don’t See When…',
    };

    const spyOnFuture = jest.spyOn(dateUtils, 'isFuture');
    spyOnFuture.mockImplementation(
      (d: Date) => d > new Date('2022-11-18T12:00:00Z')
    );

    const result = orderEventsByNextAvailableDate([evWhatYouSee]);
    expect(result).toEqual([evWhatYouSee]);
  });
});

describe('upcomingDatesFullyBooked', () => {
  it('an event is fully booked if future times are fully booked', () => {
    const event = {
      id: 'event-id',
      times: [
        {
          range: {
            startDateTime: new Date(2000, 3, 25, 15, 30, 0),
            endDateTime: new Date(2000, 3, 25, 16, 30, 0),
          },
          isFullyBooked: { inVenue: false, online: false },
        },
        {
          range: {
            startDateTime: new Date(3000, 3, 27, 15, 30, 0),
            endDateTime: new Date(3000, 3, 27, 16, 30, 0),
          },
          isFullyBooked: { inVenue: true, online: true },
        },
      ],
    };
    const result = upcomingDatesFullyBooked(event);
    expect(result).toEqual(true);
  });

  it('an event is not fully booked if in-venue tickets are still available', () => {
    const event = {
      id: 'event-id',
      times: [
        {
          range: {
            startDateTime: new Date(2000, 3, 25, 15, 30, 0),
            endDateTime: new Date(2000, 3, 25, 16, 30, 0),
          },
          isFullyBooked: { inVenue: true, online: true },
        },
        {
          range: {
            startDateTime: new Date(3000, 3, 27, 15, 30, 0),
            endDateTime: new Date(3000, 3, 27, 16, 30, 0),
          },
          isFullyBooked: { inVenue: false, online: true },
        },
      ],
    };
    const result = upcomingDatesFullyBooked(event);
    expect(result).toEqual(false);
  });

  it('an event is not fully booked if in-person tickets are sold out but online tickets are available', () => {
    const event = {
      id: 'event-id',
      times: [
        {
          range: {
            startDateTime: new Date(3000, 3, 27, 15, 30, 0),
            endDateTime: new Date(3000, 3, 27, 16, 30, 0),
          },
          isFullyBooked: { inVenue: true, online: false },
        },
      ],
    };
    const result = upcomingDatesFullyBooked(event);
    expect(result).toEqual(false);
  });

  it('an event is not fully booked if online tickets are sold out but in-person tickets are available', () => {
    const event = {
      id: 'event-id',
      times: [
        {
          range: {
            startDateTime: new Date(3000, 3, 27, 15, 30, 0),
            endDateTime: new Date(3000, 3, 27, 16, 30, 0),
          },
          isFullyBooked: { inVenue: false, online: true },
        },
      ],
    };
    const result = upcomingDatesFullyBooked(event);
    expect(result).toEqual(false);
  });

  it('an event is not fully booked if there are no future dates', () => {
    const event = {
      id: 'event-id',
      times: [],
    };
    const result = upcomingDatesFullyBooked(event);
    expect(result).toEqual(false);
  });
});

describe('groupEventsByDay', () => {
  it('works', () => {
    // This example is based on https://wellcomecollection.org/events/XHZdDRAAAHJe9rx9
    const careAndDestruction = {
      id: 'XH6TQBAAAA0FGlrx',
      title: 'Care and Destruction of a Childhood',
      times: [
        {
          range: {
            startDateTime: new Date('2019-04-06T11:30:00.000Z'),
            endDateTime: new Date('2019-04-06T12:30:00.000Z'),
          },
          isFullyBooked: { inVenue: true, online: true },
        },
      ],
    };

    const whoCriesWins = {
      id: 'XHZeuhAAAHJe9sPp',
      title: 'Who Cries Wins',
      times: [
        {
          range: {
            startDateTime: new Date('2019-04-07T13:00:00.000Z'),
            endDateTime: new Date('2019-04-07T14:00:00.000Z'),
          },
          isFullyBooked: { inVenue: true, online: true },
        },
      ],
    };

    const whiteFeminist = {
      id: 'XH6U0hAAAPXyGmIS',
      title: 'White Feminist',
      times: [
        {
          range: {
            startDateTime: new Date('2019-04-06T15:00:00.000Z'),
            endDateTime: new Date('2019-04-06T16:00:00.000Z'),
          },
          isFullyBooked: { inVenue: true, online: true },
        },
        {
          range: {
            startDateTime: new Date('2019-04-07T15:00:00.000Z'),
            endDateTime: new Date('2019-04-07T16:00:00.000Z'),
          },
          isFullyBooked: { inVenue: true, online: true },
        },
      ],
    };

    const events = [careAndDestruction, whoCriesWins, whiteFeminist];

    const result = groupEventsByDay(events);

    expect(result).toStrictEqual([
      {
        label: 'Saturday 6 April 2019',
        start: new Date('2019-04-06T00:00:00.000Z'),
        end: new Date('2019-04-06T23:59:59.999Z'),
        events: [
          {
            id: 'XH6TQBAAAA0FGlrx',
            title: 'Care and Destruction of a Childhood',
            times: [
              {
                range: {
                  startDateTime: new Date('2019-04-06T11:30:00.000Z'),
                  endDateTime: new Date('2019-04-06T12:30:00.000Z'),
                },
                isFullyBooked: { inVenue: true, online: true },
              },
            ],
          },
          {
            id: 'XH6U0hAAAPXyGmIS',
            title: 'White Feminist',
            times: [
              {
                range: {
                  startDateTime: new Date('2019-04-06T15:00:00.000Z'),
                  endDateTime: new Date('2019-04-06T16:00:00.000Z'),
                },
                isFullyBooked: { inVenue: true, online: true },
              },
            ],
          },
        ],
      },
      {
        label: 'Sunday 7 April 2019',
        start: new Date('2019-04-07T00:00:00.000Z'),
        end: new Date('2019-04-07T23:59:59.999Z'),
        events: [
          {
            id: 'XHZeuhAAAHJe9sPp',
            title: 'Who Cries Wins',
            times: [
              {
                range: {
                  startDateTime: new Date('2019-04-07T13:00:00.000Z'),
                  endDateTime: new Date('2019-04-07T14:00:00.000Z'),
                },
                isFullyBooked: { inVenue: true, online: true },
              },
            ],
          },
          {
            id: 'XH6U0hAAAPXyGmIS',
            title: 'White Feminist',
            times: [
              {
                range: {
                  startDateTime: new Date('2019-04-07T15:00:00.000Z'),
                  endDateTime: new Date('2019-04-07T16:00:00.000Z'),
                },
                isFullyBooked: { inVenue: true, online: true },
              },
            ],
          },
        ],
      },
      {
        label: 'Monday 8 April 2019',
        start: new Date('2019-04-08T00:00:00.000Z'),
        end: new Date('2019-04-08T23:59:59.999Z'),
        events: [],
      },
    ]);
  });
});
