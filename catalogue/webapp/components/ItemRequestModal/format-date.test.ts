import {
  dateAsValue,
  dateFromValue,
  formatDateForRequestsAPI,
} from './format-date';

test.each([
  { d: new Date('2022-09-21T00:00:00Z'), s: '21-09-2022' },
  { d: new Date('2022-01-02T00:00:00Z'), s: '02-01-2022' },
])('the date $d is serialised as $s', ({ d, s }) => {
  expect(dateAsValue(d)).toBe(s);
  expect(dateFromValue(s)).toStrictEqual(d);
});

test.each([
  { d: new Date('2022-09-21T00:00:00Z'), s: '2022-09-21' },
  { d: new Date('2022-09-08T00:00:00Z'), s: '2022-09-08' },
])('the date $d is formatted for the requests API as $s', ({ d, s }) => {
  expect(formatDateForRequestsAPI(d)).toBe(s);
});
