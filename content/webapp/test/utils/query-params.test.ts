import { getPage } from '@weco/content/utils/query-params';

it('returns 1 if no page parameter is supplied', () => {
  expect(getPage({})).toEqual(1);
});

it('returns the page parameter as a number, if passed', () => {
  const query = {
    page: '3',
  };

  expect(getPage(query)).toEqual(3);
});

it('returns an error if the page parameter is repeated', () => {
  const query = {
    page: ['3', '4'],
  };

  const expectedError = {
    name: 'Bad Request',
    message: 'Only supply a single "page" in the query parameter',
  };

  expect(getPage(query)).toEqual(expectedError);
});

it("returns an error if the page parameter isn't a number", () => {
  const query = {
    page: 'x',
  };

  const expectedError = {
    name: 'Bad Request',
    message: '"x" is not a number',
  };

  expect(getPage(query)).toEqual(expectedError);
});
