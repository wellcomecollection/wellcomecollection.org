import { createRegularDay } from './collection-venues';

describe('createRegularDay', () => {
  const venue = {
    id: 'WsuZKh8AAOG_NyUo',
    data: {
      title: 'Wellcome Café',
      order: 4,
      monday: [
        {
          startDateTime: '2022-01-23T10:00:00+0000',
          endDateTime: '2022-01-23T18:00:00+0000',
        },
      ],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
      modifiedDayOpeningTimes: [],
    },
  };

  it('gets the opening times for a venue which is open today', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const day = createRegularDay('Monday', venue as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    expect(day.opens).toBe('10:00');
    expect(day.closes).toBe('18:00');
    expect(day.isClosed).toBe(false);
  });

  it('gets the opening times for a closed venue', () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const day = createRegularDay('Tuesday', venue as any);
    /* eslint-enable @typescript-eslint/no-explicit-any */

    expect(day.opens).toBe('00:00');
    expect(day.closes).toBe('00:00');
    expect(day.isClosed).toBe(true);
  });
});
