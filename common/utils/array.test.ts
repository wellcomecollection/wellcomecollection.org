import {
  findLongestCommonParts,
  removeCommonParts,
  restoreCommonParts,
} from './array';

test.each([]);

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
  ({ strings, expectedCommonParts }) => {
    const actualCommonParts = findLongestCommonParts(strings);
    expect(actualCommonParts).toStrictEqual(expectedCommonParts);

    strings.forEach(s => {
      const remainingString = removeCommonParts(s, actualCommonParts);
      const restoredString = restoreCommonParts(
        remainingString,
        actualCommonParts
      );

      expect(s).toBe(restoredString);
    });
  }
);

test.each([
  {
    s: 'catastrophe',
    commonParts: { prefix: 'cata', suffix: '' },
    reducedString: 'strophe',
  },
  {
    s: 'catastrophe',
    commonParts: { prefix: '', suffix: 'rophe' },
    reducedString: 'catast',
  },
  {
    s: 'catastrophe',
    commonParts: { prefix: '', suffix: '' },
    reducedString: 'catastrophe',
  },
  {
    s: 'catastrophe',
    commonParts: { prefix: 'cata', suffix: 'rophe' },
    reducedString: 'st',
  },
])(
  '$s with common parts $commonParts is reduced to $reducedString',
  ({ s, commonParts, reducedString }) => {
    expect(removeCommonParts(s, commonParts)).toBe(reducedString);

    expect(
      restoreCommonParts(removeCommonParts(s, commonParts), commonParts)
    ).toBe(s);
  }
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
