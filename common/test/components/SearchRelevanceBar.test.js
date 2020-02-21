// @flow
import SearchRelevanceBar from '../../views/components/SearchRelevanceBar/SearchRelevanceBar';
import { mountWithTheme } from '../fixtures/enzyme-helpers';
import { act } from 'react-dom/test-utils';
import mockData from '../../__mocks__/catalogue-works-swagger.json';

jest.mock('../../services/catalogue/swagger', () => {
  return async () =>
    new Promise((resolve, reject) => {
      resolve(mockData);
    });
});

it('Renders the search relevance bar with options', async done => {
  const component = mountWithTheme(<SearchRelevanceBar />);

  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(component.find("input[type='radio']").exists()).toBe(false);
    component.update();
  }).then(r => {
    expect(component.find("input[type='radio']").exists()).toBe(true);
    done();
  });
});
