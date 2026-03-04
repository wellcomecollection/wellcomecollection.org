import { TextSlice as RawTextSlice } from '@weco/common/prismicio-types';

import { calculateReadingTime } from './reading-time';

const exampleTextSlice = {
  variation: 'default',
  version: 'initial',
  items: [],
  primary: {
    text: [
      {
        type: 'paragraph',
        text: 'A very short sentence',
        spans: [],
      },
    ],
  },
  id: 'standfirst$cdd0c06c-a8e0-4390-89fb-a1c54a35a335',
  slice_type: 'text',
  slice_label: null,
} as RawTextSlice;

it('rounds up the reading time to the next minute', () => {
  const result = calculateReadingTime([exampleTextSlice]);

  expect(result).toBe('1 minute');
});

it('handles longer pieces', () => {
  // calculateReadingTime expects a non-empty array (tuple type [T, ...T[]])
  // so we provide at least one element before spreading the rest
  const result = calculateReadingTime([
    exampleTextSlice,
    ...Array(99).fill(exampleTextSlice),
  ]);

  expect(result).toBe('2 minutes');
});
