import { Period } from '@weco/common/types/periods';
import { getExhibitionPeriodFilters, getEventFilters } from './filters';
import * as dateUtils from '@weco/common/utils/dates';

describe('getPeriodFilters', () => {
  it('uses the current time for current-and-coming-up', () => {
    const spyOnToday = jest.spyOn(dateUtils, 'today');
    spyOnToday.mockImplementation(() => new Date('2022-09-19T00:00:00Z'));

    const result = getEventFilters({
      period: 'current-and-coming-up',
      startField: 'example.events.startDateTime',
      endField: 'example.events.endDateTime',
    });

    expect(result).toStrictEqual([
      '[date.after(example.events.endDateTime, 1663545600000)]',
    ]);
  });

  it('uses the current time for past', () => {
    const spyOnToday = jest.spyOn(dateUtils, 'today');
    spyOnToday.mockImplementation(() => new Date('2022-09-19T00:00:00Z'));

    const result = getEventFilters({
      period: 'past',
      startField: 'example.events.startDateTime',
      endField: 'example.events.endDateTime',
    });

    expect(result).toStrictEqual([
      '[date.before(example.events.endDateTime, 1663545600000)]',
    ]);
  });
});

describe('getExhibitionPeriodFilters', () => {
  test.each([
    {
      period: 'current-and-coming-up',
      expectedFilters: [
        '[date.after(example.exhibitions.endDateTime, "2023-04-23")]',
      ],
    },
    {
      period: 'past',
      expectedFilters: [
        '[date.before(example.exhibitions.endDateTime, "2023-04-24")]',
      ],
    },
    {
      period: 'coming-up',
      expectedFilters: [
        '[date.after(example.exhibitions.startDateTime, "2023-04-24")]',
      ],
    },
    {
      period: 'today',
      expectedFilters: [
        '[date.before(example.exhibitions.startDateTime, "2023-04-25")]',
        '[date.after(example.exhibitions.endDateTime, "2023-04-23")]',
      ],
    },
    {
      period: 'this-weekend',
      expectedFilters: [
        '[date.before(example.exhibitions.startDateTime, "2023-05-01")]',
        '[date.after(example.exhibitions.endDateTime, "2023-04-27")]',
      ],
    },
    {
      period: 'this-week',
      expectedFilters: [
        '[date.before(example.exhibitions.startDateTime, "2023-04-30")]',
        '[date.after(example.exhibitions.endDateTime, "2023-04-22")]',
      ],
    },
    {
      period: 'next-seven-days',
      expectedFilters: [
        '[date.before(example.exhibitions.startDateTime, "2023-05-01")]',
        '[date.after(example.exhibitions.endDateTime, "2023-04-23")]',
      ],
    },
  ])(
    'the exhibition period filter for `$period` is $expectedFilters',
    ({ period, expectedFilters }) => {
      const spyOnToday = jest.spyOn(dateUtils, 'today');
      spyOnToday.mockImplementation(() => new Date('2023-04-24T12:00:00Z'));

      const result = getExhibitionPeriodFilters({
        period: period as Period,
        startField: 'example.exhibitions.startDateTime',
        endField: 'example.exhibitions.endDateTime',
      });

      expect(result).toStrictEqual(expectedFilters);
    }
  );
});
