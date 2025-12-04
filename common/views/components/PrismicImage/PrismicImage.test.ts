import { sizes } from '@weco/common/views/themes/config';

import { convertBreakpointSizesToSizes } from '.';

it('should return size in px values for xlarge breakpoint', () => {
  const test = convertBreakpointSizesToSizes({
    xlarge: 1 / 2,
  });

  expect(test).toStrictEqual([
    `(min-width: ${sizes.xlarge}px) ${sizes.xlarge / 2}px`,
  ]);
});

it('should return sizes in vw values for anything but xlarge breakpoint', () => {
  const test = convertBreakpointSizesToSizes({
    large: 1 / 1,
    medium: 1 / 2,
    small: 1 / 3,
  });

  expect(test).toStrictEqual([
    '(min-width: 1024px) 100vw',
    '(min-width: 768px) 50vw',
    '(min-width: 0px) 33vw',
  ]);
});
