import { pluralize } from './grammar';

describe('pluralize', () => {
  test.each([
    { count: 1, noun: 'result', output: '1 result' },
    { count: 5, noun: 'image', output: '5 images' },
    { count: 100, noun: 'event', output: '100 events' },
    { count: 1156915, noun: 'work', output: '1,156,915 works' },
  ])('$count × $noun is formatted as $output', ({ count, noun, output }) => {
    expect(pluralize(count, noun)).toStrictEqual(output);
  });
});
