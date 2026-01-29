import mockToday from '@weco/common/test/utils/date-mocks';

import {
  getMonthsInDateRange,
  groupEventsByMonth,
} from './whats-on.EventsByMonth.helpers';

describe('getMonthsInDateRange', () => {
  it('finds a single month', () => {
    const result = getMonthsInDateRange({
      startDate: new Date('2001-01-01'),
      endDate: new Date('2001-01-05'),
    });
    expect(result).toEqual([{ year: 2001, month: 'January' }]);
  });

  it('finds multiple months', () => {
    const result = getMonthsInDateRange({
      startDate: new Date('2001-01-01'),
      endDate: new Date('2001-03-06'),
    });
    expect(result).toEqual([
      { year: 2001, month: 'January' },
      { year: 2001, month: 'February' },
      { year: 2001, month: 'March' },
    ]);
  });

  it('finds months across a year boundary', () => {
    const result = getMonthsInDateRange({
      startDate: new Date('2001-12-01'),
      endDate: new Date('2002-02-07'),
    });
    expect(result).toEqual([
      { year: 2001, month: 'December' },
      { year: 2002, month: 'January' },
      { year: 2002, month: 'February' },
    ]);
  });
});

describe('groupEventsByMonth', () => {
  it('groups events correctly', () => {
    mockToday({ as: new Date('2022-09-08T00:00:00Z') });

    // This is based on the state of the "What's on" page on 8 September 2022
    const evShockingTreatment = {
      times: [
        {
          range: {
            startDateTime: new Date('2022-10-08T16:30:00.000Z'),
            endDateTime: new Date('2022-10-08T17:30:00.000Z'),
          },
        },
      ],
      title: 'Shocking Treatment',
    };

    const evLifeWithoutAir = {
      times: [
        {
          range: {
            startDateTime: new Date('2022-10-06T18:00:00.000Z'),
            endDateTime: new Date('2022-10-06T19:00:00.000Z'),
          },
        },
      ],
      title: 'Life Without Air with Daisy Lafarge',
    };

    const evHivAndAids = {
      times: [
        {
          range: {
            startDateTime: new Date('2022-10-18T09:30:00.000Z'),
            endDateTime: new Date('2022-10-18T14:30:00.000Z'),
          },
        },
        {
          range: {
            startDateTime: new Date('2022-11-08T10:30:00.000Z'),
            endDateTime: new Date('2022-11-08T15:30:00.000Z'),
          },
        },
        {
          range: {
            startDateTime: new Date('2022-11-30T10:30:00.000Z'),
            endDateTime: new Date('2022-11-30T15:30:00.000Z'),
          },
        },
      ],
      title: 'HIV and AIDS',
    };

    const evLegacy = {
      times: [
        {
          range: {
            startDateTime: new Date('2022-10-06T18:00:00.000Z'),
            endDateTime: new Date('2022-10-06T18:30:00.000Z'),
          },
        },
      ],
      title: 'Legacy',
    };

    const evCovid19 = {
      times: [
        {
          range: {
            startDateTime: new Date('2022-09-28T18:00:00.000Z'),
            endDateTime: new Date('2022-09-28T19:30:00.000Z'),
          },
        },
      ],
      title: 'The Covid-19 Legacy',
    };

    const evThatStinks = {
      times: [
        {
          range: {
            startDateTime: new Date('2022-09-29T17:00:00.000Z'),
            endDateTime: new Date('2022-09-29T18:00:00.000Z'),
          },
        },
      ],
      title: 'That Stinks',
    };

    const evWanderingWomb = {
      times: [
        {
          range: {
            startDateTime: new Date('2022-09-17T10:00:00.000Z'),
            endDateTime: new Date('2022-09-17T11:00:00.000Z'),
          },
        },
        {
          range: {
            startDateTime: new Date('2022-09-17T12:00:00.000Z'),
            endDateTime: new Date('2022-09-17T13:00:00.000Z'),
          },
        },
      ],
      title: 'Wandering Womb',
    };

    const events = [
      evShockingTreatment,
      evLifeWithoutAir,
      evHivAndAids,
      evLegacy,
      evCovid19,
      evThatStinks,
      evWanderingWomb,
    ];

    const groupedEvents = groupEventsByMonth(events);

    expect(groupedEvents).toStrictEqual([
      {
        month: { month: 'September', year: 2022 },
        events: [evWanderingWomb, evCovid19, evThatStinks],
      },
      {
        month: { month: 'October', year: 2022 },
        events: [evLegacy, evLifeWithoutAir, evShockingTreatment, evHivAndAids],
      },
      {
        month: { month: 'November', year: 2022 },
        events: [evHivAndAids],
      },
    ]);
  });

  // These events are based on the state of the "What's on" page in
  // early November 2022.

  const evPhobiasAndManias = {
    times: [
      {
        range: {
          startDateTime: new Date('2022-11-10T19:00:00.000Z'),
          endDateTime: new Date('2022-11-10T20:00:00.000Z'),
        },
      },
    ],
    title: 'Phobias and Manias with Kate Summerscale and Stephen Grosz',
  };

  const evWhatYouSee = {
    times: [
      {
        range: {
          startDateTime: new Date('2022-11-17T18:30:00.000Z'),
          endDateTime: new Date('2022-11-19T15:00:00.000Z'),
        },
      },
    ],
    title: 'What You See / Don’t See When…',
  };

  const evHivAndAids = {
    times: [
      {
        range: {
          startDateTime: new Date('2022-10-18T09:30:00.000Z'),
          endDateTime: new Date('2022-10-18T14:30:00.000Z'),
        },
      },
      {
        range: {
          startDateTime: new Date('2022-11-08T10:30:00.000Z'),
          endDateTime: new Date('2022-11-08T15:30:00.000Z'),
        },
      },
      {
        range: {
          startDateTime: new Date('2022-11-30T10:30:00.000Z'),
          endDateTime: new Date('2022-11-30T15:30:00.000Z'),
        },
      },
    ],
    title: 'HIV and AIDS',
  };

  const evLightsUp = {
    times: [
      {
        range: {
          startDateTime: new Date('2022-11-03T16:00:00.000Z'),
          endDateTime: new Date('2022-11-03T20:00:00.000Z'),
        },
      },
      {
        range: {
          startDateTime: new Date('2022-11-15T10:00:00.000Z'),
          endDateTime: new Date('2022-11-15T14:00:00.000Z'),
        },
      },
    ],
    title: 'Lights Up',
  };

  it('skips months that have already passed', () => {
    mockToday({ as: new Date('2022-11-02T00:00:00Z') });

    // Note that the HIV and AIDS event has multiple dates: one in October,
    // two in November.
    //
    // When we get to November, we want to make sure we aren't still showing
    // a group of October events on the "What's on" page.
    const events = [evPhobiasAndManias, evWhatYouSee, evHivAndAids];

    const groupedEvents = groupEventsByMonth(events);

    expect(groupedEvents).toStrictEqual([
      {
        month: { month: 'November', year: 2022 },
        events: [evHivAndAids, evPhobiasAndManias, evWhatYouSee],
      },
    ]);
  });

  it('includes multi-day events which have started but not finished', () => {
    mockToday({ as: new Date('2022-11-05T00:00:00Z') });

    // Notice that on 5 November, the "Light's Up" event has already started,
    // but it runs into February so we should make sure to include it
    // in the list of November events.
    const events = [evPhobiasAndManias, evWhatYouSee, evLightsUp];

    const groupedEvents = groupEventsByMonth(events);

    expect(groupedEvents).toStrictEqual([
      {
        month: { month: 'November', year: 2022 },
        events: [evPhobiasAndManias, evLightsUp, evWhatYouSee],
      },
    ]);
  });

  it('puts multi-day events at the right order in the list', () => {
    mockToday({ as: new Date('2022-11-09T00:00:00Z') });

    // Notice that on 9 November, the "HIV and AIDS" event has already
    // had its first event in the month (on 8 Nov), and the event promo
    // will be displaying the next event in the series (on 30 Nov).
    //
    // It should appear in the list based on that next date, not 8 Nov.
    const events = [evHivAndAids, evPhobiasAndManias, evWhatYouSee];

    const groupedEvents = groupEventsByMonth(events);

    expect(groupedEvents).toStrictEqual([
      {
        month: { month: 'November', year: 2022 },
        events: [
          // 10 Nov
          evPhobiasAndManias,

          // 17 Nov – 19 Nov
          evWhatYouSee,

          // 30 Nov
          evHivAndAids,
        ],
      },
    ]);
  });

  it('includes festivals that are midway through their run', () => {
    mockToday({ as: new Date('2022-11-18T12:00:00Z') });

    // The "What You See" event is a three-day festival from 17–19 Nov
    // with a single entry in the 'times' block; on 18 Nov it's on
    // its second day, so we should make sure we still show it.
    const events = [evWhatYouSee];

    const groupedEvents = groupEventsByMonth(events);

    expect(groupedEvents).toStrictEqual([
      {
        month: { month: 'November', year: 2022 },
        events: [evWhatYouSee],
      },
    ]);
  });

  it('handles events with future end dates but all scheduled times in the past', () => {
    mockToday({ as: new Date('2022-11-10T13:00:00Z') });
    // - Parent event has a future end date (Nov 20)
    // - All scheduled times are in the past (Nov 10 @ 12:30, before current time 13:00)
    const evWithPastScheduledTimes = {
      times: [
        {
          range: {
            startDateTime: new Date('2022-11-10T12:00:00.000Z'),
            endDateTime: new Date('2022-11-10T12:30:00.000Z'),
          },
        },
      ],
      title: 'Event with past scheduled times',
    };

    const evWithFutureTimes = {
      times: [
        {
          range: {
            startDateTime: new Date('2022-11-15T10:00:00.000Z'),
            endDateTime: new Date('2022-11-15T11:00:00.000Z'),
          },
        },
      ],
      title: 'Normal future event',
    };

    // Should not throw and should exclude the event with no future times
    const groupedEvents = groupEventsByMonth([
      evWithPastScheduledTimes,
      evWithFutureTimes,
    ]);

    expect(groupedEvents).toStrictEqual([
      {
        month: { month: 'November', year: 2022 },
        events: [evWithFutureTimes],
      },
    ]);
  });
});
