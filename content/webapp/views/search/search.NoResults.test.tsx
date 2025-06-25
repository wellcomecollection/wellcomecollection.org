import { renderWithTheme } from '@weco/common/test/fixtures/test-helpers';

import SearchNoResults from '.';

describe('SearchNoResults', () => {
  const query = 'hello-query-results';

  it('matches the display query param with the results', () => {
    const { getByText } = renderWithTheme(
      <SearchNoResults query={query} hasFilters={false} />
    );
    expect(getByText(query));
    expect(() => getByText('with the filters you have selected')).toThrow();
  });

  it('displays no results with filters selected', () => {
    const { container, getByText } = renderWithTheme(
      <SearchNoResults query={query} hasFilters={true} />
    );
    expect(getByText(query));
    expect(
      container.innerHTML.includes('with the filters you have selected')
    ).toBe(true);
  });
});
