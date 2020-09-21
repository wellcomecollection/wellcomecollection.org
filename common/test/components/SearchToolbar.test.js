// @flow
import SearchToolbar from '../../views/components/SearchToolbar/SearchToolbar';
import { mountWithTheme, updateWrapperAsync } from '../fixtures/enzyme-helpers';
import mockData from '../../__mocks__/catalogue-works-swagger.json';

jest.mock('../../services/catalogue/swagger', () => {
  return async () =>
    new Promise((resolve, reject) => {
      resolve(mockData);
    });
});

it('Renders the search relevance bar with options', async () => {
  const component = mountWithTheme(<SearchToolbar />);
  expect(component.find("input[type='radio']").exists()).toBe(false);

  await updateWrapperAsync(component);
  expect(component.find("input[type='radio']").exists()).toBe(true);
});
