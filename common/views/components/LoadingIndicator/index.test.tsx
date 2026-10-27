import NProgress from 'nprogress';

import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';

import LoadingIndicator from '.';

describe('LoadingIndicator', () => {
  afterEach(() => NProgress.remove());

  it('renders the progress bar without invalid ARIA roles', () => {
    const { container } = renderWithTheme(<LoadingIndicator />);

    NProgress.start();

    const wrapper = container.querySelector(
      '[data-component="loading-indicator"]'
    );
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper?.querySelector('[data-nprogress-bar]')).not.toBeNull();
    expect(wrapper?.querySelector('[role]')).toBeNull();
  });
});
