import { calculateReadingTime } from './reading-time';

it('rounds up the reading time to the next minute', () => {
  const result = calculateReadingTime([
    {
      value: [{ text: 'A very short sentence', spans: [], type: 'paragraph' }],
      type: 'text',
    },
  ]);

  expect(result).toBe('1 minute');
});

it('handles longer pieces', () => {
  const result = calculateReadingTime(
    [...Array(100)].map(() => ({
      value: [{ text: 'A very short sentence', spans: [], type: 'paragraph' }],
      type: 'text',
    }))
  );

  expect(result).toBe('2 minutes');
});
