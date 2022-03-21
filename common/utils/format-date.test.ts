import {
  formatDate,
  formatDay,
  formatDayDate,
  formatTime,
} from './format-date';

it('formats a day', () => {
  const result = formatDay(new Date(2001, 1, 1, 1, 1, 1));

  expect(result).toEqual('Thursday');
});

it('formats a day with a date', () => {
  const result = formatDayDate(new Date(2001, 2, 3, 1, 1, 1));

  expect(result).toEqual('Saturday 3 March 2001');
});

it('formats a date', () => {
  const result = formatDate(new Date(2009, 3, 27, 1, 1, 1));

  expect(result).toEqual('27 April 2009');
});

it('formats a timestamp', () => {
  const result1 = formatTime(new Date(2009, 3, 27, 17, 21, 1));
  expect(result1).toEqual('17:21');

  const result2 = formatTime(new Date(2009, 3, 27, 9, 41, 1));
  expect(result2).toEqual('09:41');
});
