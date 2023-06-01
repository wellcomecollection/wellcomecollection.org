import { commonPrefix, longestCommonPrefix } from './compressed-manifest';

test.each([
  { s1: 'duck', s2: 'goose', expectedPrefix: '' },
  { s1: 'this', s2: 'that', expectedPrefix: 'th' },
  { s1: 'this', s2: 'this', expectedPrefix: 'this' },
  { s1: 'drag', s2: 'dragon', expectedPrefix: 'drag' },
  { s1: 'dragon', s2: 'drag', expectedPrefix: 'drag' },
  { s1: 'linger', s2: 'longer', expectedPrefix: 'l' },
])(
  'the common prefix of $s1 and $s2 is $expectedPrefix',
  ({ s1, s2, expectedPrefix }) => {
    expect(commonPrefix(s1, s2)).toBe(expectedPrefix);
  }
);

test.each([
  { strings: [], expectedCommonPrefix: '' },
  { strings: ['cat'], expectedCommonPrefix: 'cat' },
  { strings: ['cat', 'catastrophe', 'car'], expectedCommonPrefix: 'ca' },
  { strings: ['cat', 'dog'], expectedCommonPrefix: '' },
])(
  'the longest common prefix of $strings is $expectedCommonPrefix',
  ({ strings, expectedCommonPrefix }) =>
    expect(longestCommonPrefix(strings)).toBe(expectedCommonPrefix)
);
