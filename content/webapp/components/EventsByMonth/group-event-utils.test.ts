import {
  createLabel,
  findMonthsThatEventSpans,
  getMonthsInDateRange,
  groupEventsByMonth,
  sortByEarliestFutureDateRange,
} from './group-event-utils';

describe('createLabel', () => {
  it('zero-pads the month value', () => {
    expect(createLabel({ year: 2001, month: 1 })).toEqual('2001-02');
  });

  it('gets the right label', () => {
    expect(createLabel({ year: 2001, month: 11 })).toEqual('2001-12');
  });
});

describe('getMonthsInDateRange', () => {
  it('finds a single month', () => {
    const result = getMonthsInDateRange({
      start: new Date(2001, 1, 1),
      end: new Date(2001, 1, 5),
    });
    expect(result).toEqual([{ year: 2001, month: 1 }]);
  });

  it('finds multiple months', () => {
    const result = getMonthsInDateRange({
      start: new Date(2001, 1, 1),
      end: new Date(2001, 3, 6),
    });
    expect(result).toEqual([
      { year: 2001, month: 1 },
      { year: 2001, month: 2 },
      { year: 2001, month: 3 },
    ]);
  });
});

describe('findMonthsThatEventSpans', () => {
  it('finds the correct months for each event', () => {
    const event1 = {
      id: '1',
      times: [
        {
          range: {
            startDateTime: new Date(2001, 1, 1),
            endDateTime: new Date(2001, 1, 5),
          },
          isFullyBooked: false,
        },
      ],
    };

    const event2 = {
      id: '2',
      times: [
        {
          range: {
            startDateTime: new Date(2001, 1, 1),
            endDateTime: new Date(2001, 3, 6),
          },
          isFullyBooked: false,
        },
      ],
    };

    const result = findMonthsThatEventSpans([event1, event2]);

    expect(result).toEqual([
      { event: event1, months: [{ year: 2001, month: 1 }] },
      {
        event: event2,
        months: [
          { year: 2001, month: 1 },
          { year: 2001, month: 2 },
          { year: 2001, month: 3 },
        ],
      },
    ]);
  });
});

describe('groupEventsByMonth', () => {
  it('puts each event in the right month', () => {
    const event1 = {
      id: '1',
      times: [
        {
          range: {
            startDateTime: new Date(2101, 1, 1),
            endDateTime: new Date(2101, 1, 5),
          },
          isFullyBooked: false,
        },
      ],
    };

    const event2 = {
      id: '2',
      times: [
        {
          range: {
            startDateTime: new Date(2101, 1, 1),
            endDateTime: new Date(2101, 3, 6),
          },
          isFullyBooked: false,
        },
      ],
    };

    const result = groupEventsByMonth([event1, event2]);

    expect(result).toEqual({
      '2101-02': [event1, event2],
      '2101-04': [event2],
    });
  });
});

describe('sortByEarliestFutureDateRange', () => {
  it('sorts a group of events correctly', () => {
    // These examples are based on events from a bug report, where an event
    // happening at the end of the month was appearing one happening at the
    // start of the month, because the later event had only just been added
    // to Prismic.
    //
    // See https://wellcome.slack.com/archives/C8X9YKM5X/p1651224877047299
    const eventSlalom = {
      title: 'Slalom',
      times: [
        {
          range: {
            startDateTime: new Date('2032-05-25T23:00:00.000Z'),
            endDateTime: new Date('2032-05-27T23:00:00.000Z'),
          },
          isFullyBooked: false,
        },
      ],
    };

    const eventGardenersQT = {
      title: 'Gardeners’ Question Time',
      times: [
        {
          range: {
            startDateTime: new Date('2032-05-09T17:00:00.000Z'),
            endDateTime: new Date('2032-05-09T19:00:00.000Z'),
          },
          isFullyBooked: false,
        },
      ],
    };

    const eventMentalHealth = {
      title: 'The Nature of Mental Health',
      times: [
        {
          range: {
            startDateTime: new Date('2032-05-12T18:00:00.000Z'),
            endDateTime: new Date('2032-05-12T19:30:00.000Z'),
          },
          isFullyBooked: false,
        },
      ],
    };

    const eventWomb = {
      title: 'Wandering Womb',
      times: [
        {
          range: {
            startDateTime: new Date('2032-05-14T10:00:00.000Z'),
            endDateTime: new Date('2032-05-14T16:00:00.000Z'),
          },
          isFullyBooked: false,
        },
      ],
    };

    const eventTouch = {
      title: 'Personal Touch',
      times: [
        {
          range: {
            startDateTime: new Date('2032-05-07T09:00:00.000Z'),
            endDateTime: new Date('2032-05-07T16:00:00.000Z'),
          },
          isFullyBooked: false,
        },
      ],
    };

    const result = sortByEarliestFutureDateRange([
      eventSlalom,
      eventGardenersQT,
      eventMentalHealth,
      eventWomb,
      eventTouch,
    ]);

    expect(result).toEqual([
      eventTouch,
      eventGardenersQT,
      eventMentalHealth,
      eventWomb,
      eventSlalom,
    ]);
  });
});
