import { dateAsValue, dateFromValue } from './format-date';

it('serialises a date as DD-MM-YYYY', () => {
  const d = new Date('2022-09-08');
  const s = dateAsValue(d);

  expect(s).toBe('08-09-2022');
  expect(dateFromValue(s)).toStrictEqual(d);
});
