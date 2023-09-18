import { HasTimes } from '@weco/content/types/events';
import { isUpcoming } from './event-series';
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
