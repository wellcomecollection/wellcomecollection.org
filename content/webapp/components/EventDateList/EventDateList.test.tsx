import {
  renderWithTheme,
  withMarkup,
} from '@weco/common/test/fixtures/test-helpers';
import * as dateUtils from '@weco/common/utils/dates';
import EventDateList from '.';
import { HasTimes } from '@weco/content/types/events';

describe('DateList', () => {
  it('doesn’t show anything if there aren’t any times', () => {
    const { container } = renderWithTheme(
      <EventDateList event={{ times: [] }} />
    );
    expect(container.innerHTML).toBe('');
  });

  const event: HasTimes = {
    times: [
      {
        range: {
          startDateTime: new Date('2001-01-01T01:01:01Z'),
          endDateTime: new Date('2002-02-02T02:02:02Z'),
        },
        isFullyBooked: { inVenue: true, online: true },
      },
    ],
  };

  it('shows a “Full” indicator for an upcoming event if it’s fully booked', () => {
    jest.spyOn(dateUtils, 'isPast').mockImplementation((date: Date) => {
      return date < new Date('2000-01-01T00:00:00Z');
    });

    const { getByText } = renderWithTheme(<EventDateList event={event} />);
    withMarkup(getByText, 'Full');
  });

  it('shows a “Past” indicator for a past event if it’s fully booked', () => {
    jest.spyOn(dateUtils, 'isPast').mockImplementation((date: Date) => {
      return date < new Date('2023-01-01T00:00:00Z');
    });

    const { getByText } = renderWithTheme(<EventDateList event={event} />);
    withMarkup(getByText, 'Past');
  });

  it('shows a “Past” indicator for a past event, if it’s the same day but the event is over', () => {
    jest.spyOn(dateUtils, 'isPast').mockImplementation((date: Date) => {
      return date < new Date('2002-02-02T12:00:00Z');
    });

    const { getByText } = renderWithTheme(<EventDateList event={event} />);
    withMarkup(getByText, 'Past');
  });
});
