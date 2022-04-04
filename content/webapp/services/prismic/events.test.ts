import { orderEventsByNextAvailableDate } from './events';

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
});
