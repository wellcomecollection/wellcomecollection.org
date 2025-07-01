import {
  dateAsValue,
  dateFromValue,
  formatDateForRequestsAPI,
} from './ItemRequestModal.helpers';

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
  { d: new Date('2022-12-31T00:00:00Z'), s: '2022-12-31' },
  // Check we're using the calendar date, and not the ISO week date
  // (See https://alexwlchan.net/2021/01/what-year-it-it)
  { d: new Date('2021-01-01T00:00:00Z'), s: '2021-01-01' },
])('the date $d is formatted for the requests API as $s', ({ d, s }) => {
  expect(formatDateForRequestsAPI(d)).toBe(s);
});
