import SearchNoResults from './SearchNoResults';
import { shallowWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';

describe('SearchNoResults', () => {
  const query = 'hello-query-results';

  it('matches the display query param with the results', () => {
    const component = shallowWithTheme(
      <SearchNoResults query={query} hasFilters={false} />
    );
    expect(component.html()).toMatch(query);
    expect(component.html()).not.toMatch('with the filters you have selected');
  });

  it('displays no results with filters selected', () => {
    const component = shallowWithTheme(
      <SearchNoResults query={query} hasFilters={true} />
    );
    expect(component.html()).toMatch(query);
    expect(component.html()).toMatch('with the filters you have selected');
  });
});
