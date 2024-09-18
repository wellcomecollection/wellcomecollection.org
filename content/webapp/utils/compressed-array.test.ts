import { fromCommonParts, toCommonParts } from './compressed-array';

test.each([
  {
    strings: [],
    expectedCommonParts: { prefix: '', suffix: '', remainders: [] },
  },
  {
    strings: ['cat'],
    expectedCommonParts: { prefix: 'cat', suffix: '', remainders: [''] },
  },
  {
    strings: ['cat', 'catastrophe', 'car'],
    expectedCommonParts: {
      prefix: 'ca',
      suffix: '',
      remainders: ['t', 'tastrophe', 'r'],
    },
  },
  {
    strings: ['cat', 'catastrophe', 'cataclysm'],
    expectedCommonParts: {
      prefix: 'cat',
      suffix: '',
      remainders: ['', 'astrophe', 'aclysm'],
    },
  },
  {
    strings: ['shine', 'brine', 'line'],
    expectedCommonParts: {
      prefix: '',
      suffix: 'ine',
      remainders: ['sh', 'br', 'l'],
    },
  },
  {
    strings: ['sunshine', 'saline', 'supine'],
    expectedCommonParts: {
      prefix: 's',
      suffix: 'ine',
      remainders: ['unsh', 'al', 'up'],
    },
  },
  {
    strings: ['bumble', 'humble', undefined, 'mumble'],
    expectedCommonParts: {
      prefix: '',
      suffix: 'umble',
      remainders: ['b', 'h', undefined, 'm'],
    },
  },
])(
  'the common parts of $strings are $expectedCommonParts',
  ({ strings, expectedCommonParts }) => {
    const actualCommonParts = toCommonParts(strings);
    expect(actualCommonParts).toStrictEqual(expectedCommonParts);

    expect(fromCommonParts(actualCommonParts)).toStrictEqual(strings);
  }
);
