import { formatNumber, kebabise, pluralize } from './grammar';

describe('formatNumber', () => {
  test.each([
    { n: 1, output: '1' },
    { n: 5, output: '5' },
    { n: 100, output: '100' },
    { n: 1156915, output: '1,156,915' },
    { n: 19, options: { isCompact: true }, output: '19' },
    { n: 198, options: { isCompact: true }, output: '198' },
    { n: 1942, options: { isCompact: true }, output: '1.9K' },
    { n: 1962, options: { isCompact: true }, output: '2K' },
    { n: 1194567, options: { isCompact: true }, output: '1.2M' },
  ])('$n is formatted as $output', ({ n, options, output }) => {
    expect(formatNumber(n, { isCompact: !!options?.isCompact })).toStrictEqual(
      output
    );
  });
});

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

describe('kebabise', () => {
  test.each([
    { input: 'Hello World', output: 'hello-world' },
    { input: '  Hello   World  ', output: 'hello-world' },
    { input: 'Hello---World', output: 'hello-world' },
    { input: 'Hello_world', output: 'hello-world' },
    { input: 'A&B', output: 'a-b' },
    { input: 'A / B', output: 'a-b' },
    { input: 'The 2nd Age', output: 'the-2nd-age' },
    { input: '--Already-kebab--', output: 'already-kebab' },
    { input: 'Café', output: 'caf' },
    { input: '...', output: '' },
    { input: '  ', output: '' },
    { input: '123', output: '123' },
  ])('kebabise($input) -> $output', ({ input, output }) => {
    expect(kebabise(input)).toStrictEqual(output);
  });
});
