import { findLongestCommonParts } from './array';

test.each([]);

// import {
//   commonPrefix,
//   longestCommonPrefix,
//   longestCommonSuffix,
// } from './array';

// test.each([
//   { s1: 'duck', s2: 'goose', expectedPrefix: '' },
//   { s1: 'this', s2: 'that', expectedPrefix: 'th' },
//   { s1: 'this', s2: 'this', expectedPrefix: 'this' },
//   { s1: 'drag', s2: 'dragon', expectedPrefix: 'drag' },
//   { s1: 'dragon', s2: 'drag', expectedPrefix: 'drag' },
//   { s1: 'linger', s2: 'longer', expectedPrefix: 'l' },
// ])(
//   'the common prefix of $s1 and $s2 is $expectedPrefix',
//   ({ s1, s2, expectedPrefix }) => {
//     expect(commonPrefix(s1, s2)).toBe(expectedPrefix);
//   }
// );

test.each([
  { strings: [], expectedCommonParts: { prefix: '', suffix: '' } },
  { strings: ['cat'], expectedCommonParts: { prefix: 'cat', suffix: '' } },
  {
    strings: ['cat', 'catastrophe', 'car'],
    expectedCommonParts: { prefix: 'ca', suffix: '' },
  },
  {
    strings: ['shine', 'brine', 'line'],
    expectedCommonParts: { prefix: '', suffix: 'ine' },
  },
  {
    strings: ['sunshine', 'saline', 'supine'],
    expectedCommonParts: { prefix: 's', suffix: 'ine' },
  },
])(
  'the common parts of $strings are $expectedCommonParts',
  ({ strings, expectedCommonParts }) =>
    expect(findLongestCommonParts(strings)).toStrictEqual(expectedCommonParts)
);

// test.each([
//   { strings: [], expectedCommonSuffix: '' },
//   { strings: ['cat'], expectedCommonSuffix: 'cat' },
//   { strings: ['scat', 'bat', 'cat'], expectedCommonSuffix: 'at' },
//   { strings: ['cat', 'dog'], expectedCommonSuffix: '' },
// ])(
//   'the longest common suffix of $strings is $expectedCommonSuffix',
//   ({ strings, expectedCommonSuffix }) =>
//     expect(longestCommonSuffix(strings)).toBe(expectedCommonSuffix)
// );
