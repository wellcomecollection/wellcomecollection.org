import { Period } from '@weco/content/types/periods';
import {
  getExhibitionPeriodPredicates,
  getEventPredicates,
} from './predicates';
import * as dateUtils from '@weco/common/utils/dates';

describe('getPeriodPredicates', () => {
  it('uses the current time for current-and-coming-up', () => {
    const spyOnToday = jest.spyOn(dateUtils, 'today');
    spyOnToday.mockImplementation(() => new Date('2022-09-19T00:00:00Z'));

    const result = getEventPredicates({
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

    const result = getEventPredicates({
      period: 'past',
      startField: 'example.events.startDateTime',
      endField: 'example.events.endDateTime',
    });

    expect(result).toStrictEqual([
      '[date.before(example.events.endDateTime, 1663545600000)]',
    ]);
  });
});

describe('getExhibitionPeriodPredicates', () => {
  test.each([
    {
      period: 'current-and-coming-up',
      expectedPredicates: [
        '[date.after(example.exhibitions.endDateTime, "2023-04-23")]',
      ],
    },
    {
      period: 'past',
      expectedPredicates: [
        '[date.before(example.exhibitions.endDateTime, "2023-04-24")]',
      ],
    },
    {
      period: 'coming-up',
      expectedPredicates: [
        '[date.after(example.exhibitions.startDateTime, "2023-04-24")]',
      ],
    },
    {
      period: 'today',
      expectedPredicates: [
        '[date.before(example.exhibitions.startDateTime, "2023-04-25")]',
        '[date.after(example.exhibitions.endDateTime, "2023-04-23")]',
      ],
    },
    {
      period: 'this-weekend',
      expectedPredicates: [
        '[date.before(example.exhibitions.startDateTime, "2023-05-01")]',
        '[date.after(example.exhibitions.endDateTime, "2023-04-27")]',
      ],
    },
    {
      period: 'this-week',
      expectedPredicates: [
        '[date.before(example.exhibitions.startDateTime, "2023-04-30")]',
        '[date.after(example.exhibitions.endDateTime, "2023-04-22")]',
      ],
    },
    {
      period: 'next-seven-days',
      expectedPredicates: [
        '[date.before(example.exhibitions.startDateTime, "2023-05-01")]',
        '[date.after(example.exhibitions.endDateTime, "2023-04-23")]',
      ],
    },
  ])(
    'the exhibition period predicate for `$period` is $expectedPredicates',
    ({ period, expectedPredicates }) => {
      const spyOnToday = jest.spyOn(dateUtils, 'today');
      spyOnToday.mockImplementation(() => new Date('2023-04-24T12:00:00Z'));

      const result = getExhibitionPeriodPredicates({
        period: period as Period,
        startField: 'example.exhibitions.startDateTime',
        endField: 'example.exhibitions.endDateTime',
      });

      expect(result).toStrictEqual(expectedPredicates);
    }
  );
});
