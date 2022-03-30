import {
  createLabel,
  findMonthsThatEventSpans,
  getMonthsInDateRange,
  groupEventsByMonth,
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
