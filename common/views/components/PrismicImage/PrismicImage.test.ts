import { convertBreakpointSizesToSizes } from '.';

it('should return size in px values for lg breakpoint', () => {
  const test = convertBreakpointSizesToSizes({
    lg: 1 / 2,
  });

  expect(test).toStrictEqual(['(min-width: 1440px) 720px']);
});

it('should return sizes in vw values for anything but lg breakpoint', () => {
  const test = convertBreakpointSizesToSizes({
    md: 1 / 1,
    sm: 1 / 2,
    zero: 1 / 3,
  });

  expect(test).toStrictEqual([
    '(min-width: 1024px) 100vw',
    '(min-width: 768px) 50vw',
    '(min-width: 0px) 33vw',
  ]);
});
