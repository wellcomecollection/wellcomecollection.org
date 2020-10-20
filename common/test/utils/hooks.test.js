// @flow
import { getScreenSize } from '@weco/common/hooks/useWindowSize';
import theme from '@weco/common/views/themes/default';

it('should get return the appropriate screen size string based on our theme', () => {
  const windowSpy = jest.spyOn(global, 'window', 'get');
  const mediumScreenSize =
    theme.sizes.medium + (theme.sizes.large - theme.sizes.medium) / 2;

  windowSpy.mockImplementation(() => ({
    innerWidth: mediumScreenSize,
  }));

  const screenSize = getScreenSize(window);
  expect(screenSize).toBe('medium');
});
