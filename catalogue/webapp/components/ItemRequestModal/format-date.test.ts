import { dateAsValue, dateFromValue } from './format-date';

test.each([
  { d: new Date('2022-09-21T00:00:00Z'), s: '21-09-2022' },
  { d: new Date('2022-01-02T00:00:00Z'), s: '02-01-2022' },
])('the date $d is serialised as $s', ({ d, s }) => {
  expect(dateAsValue(d)).toBe(s);
  expect(dateFromValue(s)).toStrictEqual(d);
});
