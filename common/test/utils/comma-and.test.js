// @flow
import {commaAnd} from '../../utils/comma-and';

it('should separate a list with comma, and if > 1 item, use an "and"', () => {
  const one = ['Nut'];
  const two = ['Nut', 'Geb'];
  const three = ['Nut', 'Geb', 'Sally'];

  expect(commaAnd(one)).toBe('Nut');
  expect(commaAnd(two)).toBe('Nut and Geb');
  expect(commaAnd(three)).toBe('Nut, Geb and Sally');
});
