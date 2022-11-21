import {
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
          isFullyBooked: false,
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
          isFullyBooked: false,
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
  it('returns true if future dates are not available to book', () => {
    const event = {
      id: 'event-id',
      times: [
        {
          range: {
            startDateTime: new Date(2000, 3, 25, 15, 30, 0),
            endDateTime: new Date(2000, 3, 25, 16, 30, 0),
          },
          isFullyBooked: false,
        },
        {
          range: {
            startDateTime: new Date(3000, 3, 27, 15, 30, 0),
            endDateTime: new Date(3000, 3, 27, 16, 30, 0),
          },
          isFullyBooked: true,
        },
      ],
    };
    const result = upcomingDatesFullyBooked(event);
    expect(result).toEqual(true);
  });

  it('returns false if future dates are available to book', () => {
    const event = {
      id: 'event-id',
      times: [
        {
          range: {
            startDateTime: new Date(2000, 3, 25, 15, 30, 0),
            endDateTime: new Date(2000, 3, 25, 16, 30, 0),
          },
          isFullyBooked: true,
        },
        {
          range: {
            startDateTime: new Date(3000, 3, 27, 15, 30, 0),
            endDateTime: new Date(3000, 3, 27, 16, 30, 0),
          },
          isFullyBooked: false,
        },
      ],
    };
    const result = upcomingDatesFullyBooked(event);
    expect(result).toEqual(false);
  });

  it('returns false if there are no future dates', () => {
    const event = {
      id: 'event-id',
      times: [
        {
          range: {
            startDateTime: new Date(2000, 3, 25, 15, 30, 0),
            endDateTime: new Date(2000, 3, 25, 16, 30, 0),
          },
          isFullyBooked: true,
        },
      ],
    };
    const result = upcomingDatesFullyBooked(event);
    expect(result).toEqual(false);
  });
});
