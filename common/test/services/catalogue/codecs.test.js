// @flow
import { serialiseUrl, WorksRoute } from '../../../services/catalogue/codecs';

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

test('worksRouteState: with no values', () => {
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

test('worksRouteState: with values', () => {
  const query = {
    query: 'gargoyles',
    page: '3',
    workType: 'a,b,c',
    'production.dates.from': '1500',
    'production.dates.to': '1900',
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
