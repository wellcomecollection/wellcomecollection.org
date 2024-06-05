import { calculateReadingTime } from './reading-time';
import { TextSlice } from '@weco/common/prismicio-types';

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
} as TextSlice;

it('rounds up the reading time to the next minute', () => {
  const result = calculateReadingTime([exampleTextSlice]);

  expect(result).toBe('1 minute');
});

it('handles longer pieces', () => {
  const result = calculateReadingTime(
    [...Array(100)].map(() => exampleTextSlice)
  );

  expect(result).toBe('2 minutes');
});
