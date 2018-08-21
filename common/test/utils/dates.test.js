// @flow
import {london} from '../../utils/format-date';
import {getEarliestFutureDateRange} from '../../utils/dates';

it('should get the earliest future date', () => {
  const rightAnswer = {
    start: london().add(1, 'minute').toDate(),
    end: london().add(2, 'day').toDate()
  };
  const dateRanges = [{
    start: london().subtract(2, 'day').toDate(),
    end: london().add(1, 'day').toDate()
  }, rightAnswer, {
    start: london().add(1, 'day').toDate(),
    end: london().add(2, 'day').toDate()
  }];

  const earliestFutureDateRange = getEarliestFutureDateRange(dateRanges);
  expect(earliestFutureDateRange && earliestFutureDateRange.start).toBe(rightAnswer.start);
});
