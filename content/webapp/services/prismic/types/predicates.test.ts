import { getPeriodPredicates } from './predicates';
import * as dateUtils from '@weco/common/utils/dates';

describe('getPeriodPredicates', () => {
  it('uses the current time for current-and-coming-up', () => {
    const spyOnToday = jest.spyOn(dateUtils, 'today');
    spyOnToday.mockImplementation(() => new Date('2022-09-19T00:00:00Z'));

    const result = getPeriodPredicates({
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

    const result = getPeriodPredicates({
      period: 'past',
      startField: 'example.events.startDateTime',
      endField: 'example.events.endDateTime',
    });

    expect(result).toStrictEqual([
      '[date.before(example.events.endDateTime, 1663545600000)]',
    ]);
  });
});
