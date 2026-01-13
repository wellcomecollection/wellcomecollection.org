import { RawCollectionVenueDocumentLite } from '@weco/common/server-data/prismic';

import { createRegularDay } from './collection-venues';

describe('createRegularDay', () => {
  const venue: RawCollectionVenueDocumentLite = {
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
    const day = createRegularDay('Monday', venue);

    expect(day.opens).toBe('10:00');
    expect(day.closes).toBe('18:00');
    expect(day.isClosed).toBe(false);
  });

  it('gets the opening times for a closed venue', () => {
    const day = createRegularDay('Tuesday', venue);

    expect(day.opens).toBe('00:00');
    expect(day.closes).toBe('00:00');
    expect(day.isClosed).toBe(true);
  });
});
