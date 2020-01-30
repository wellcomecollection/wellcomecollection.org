// @flow
import {
  serialiseUrl,
  WorksRoute,
  WorkRoute,
} from '../../../services/catalogue/routes';

test('it serialises URLs in a weco fashion', () => {
  const query = {
    zeroProp: 0,
    page: 1,
    numberProp: 2,
    emptyStringQuery: '',
    stringProp: 'string',
    emptyArrayProp: [],
    arrayProp: ['a', 'b'],
    nullProp: null,
    undefinedProp: undefined,
  };

  expect(serialiseUrl(query)).toEqual({
    zeroProp: '0',
    // page: 1,
    numberProp: '2',
    // emptyStringQuery: '',
    stringProp: 'string',
    // emptyArrayProp: [],
    arrayProp: 'a,b',
    // nullProp: null,
    // undefinedProp: undefined,
  });
});

test('/works: with no values', () => {
  const query = {};
  const worksRouteState = WorksRoute.fromQuery(query);

  expect(worksRouteState).toEqual({
    query: '',
    page: 1,
    workType: [],
    itemsLocationsLocationType: [],
    sort: null,
    sortOrder: null,
    productionDatesFrom: null,
    productionDatesTo: null,
    search: null,
    source: null,
  });
});

test('/works: with values', () => {
  const query = {
    query: 'gargoyles',
    page: '3',
    workType: 'a,b,c',
    'production.dates.from': '1500',
    'production.dates.to': '1900',
    notValid: '( ͡° ͜ʖ ͡°)',
  };
  const worksRouteState = WorksRoute.fromQuery(query);

  expect(worksRouteState).toEqual({
    query: 'gargoyles',
    page: 3,
    workType: ['a', 'b', 'c'],
    itemsLocationsLocationType: [],
    sort: null,
    sortOrder: null,
    productionDatesFrom: '1500',
    productionDatesTo: '1900',
    search: null,
    source: null,
  });
});

// route: /works/{id}
test('/works/{id}: with no values', () => {
  const query = {};
  const worksRouteState = WorkRoute.fromQuery(query);

  expect(worksRouteState).toEqual({ id: '' });
});

test('/works/{id}: with values', () => {
  const query = {
    id: 'm4b34tup',
    notValid: '( ͡° ͜ʖ ͡°)',
  };
  const workRoute = WorkRoute.fromQuery(query);

  expect(workRoute).toEqual({
    id: 'm4b34tup',
  });
});
