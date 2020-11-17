import SearchNoResults from './SearchNoResults';
import { shallowWithTheme } from '@weco/common/test/fixtures/enzyme-helpers';

describe('SearchNoResults', () => {
  const query = 'hello-query-results';

  it('it should match display query param with the results', () => {
    const component = shallowWithTheme(<SearchNoResults query={query} />);
    expect(component.html()).toMatch(query);
  });

  it('it should display no results with filters selected', () => {
    const component = shallowWithTheme(
      <SearchNoResults query={query} hasFilters={true} />
    );
    expect(component.html()).toMatch('with the filters you have selected');
  });
});
