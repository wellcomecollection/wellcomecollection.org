import {
  serialiseUrl,
  WorksRoute,
  WorkRoute,
  ItemRoute,
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
    nullProp: undefined,
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
    // nullProp: undefined,
    // undefinedProp: undefined,
  });
});

// route: /works
test('/works: with no values', () => {
  const query = {};
  const worksRouteState = WorksRoute.fromQuery(query);

  expect(worksRouteState).toEqual({
    query: '',
    page: 1,
    workType: [],
    itemsLocationsLocationType: [],
    availabilities: [],
    sort: undefined,
    sortOrder: undefined,
    productionDatesFrom: undefined,
    productionDatesTo: undefined,
    search: undefined,
    source: undefined,
    imagesColor: undefined,
    genresLabel: [],
    subjectsLabel: [],
    languages: [],
    contributorsAgentLabel: [],
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
    availabilities: [],
    sort: undefined,
    sortOrder: undefined,
    productionDatesFrom: '1500',
    productionDatesTo: '1900',
    search: undefined,
    source: undefined,
    imagesColor: undefined,
    genresLabel: [],
    subjectsLabel: [],
    languages: [],
    contributorsAgentLabel: [],
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

// route: /works/{id}/items
test('/works/{id}/items: with no values', () => {
  const query = {};
  const worksRouteState = ItemRoute.fromQuery(query);

  expect(worksRouteState).toEqual({
    workId: '',
    langCode: 'eng',
    sierraId: undefined,
    pageSize: 4,
    canvas: 1,
    manifest: 1,
    isOverview: false,
    page: 1,
  });
});

test('/works/{id}/items: with values', () => {
  const query = {
    workId: 'm4b34tup',
    langCode: 'mul',
    sierraId: 'b1234567',
    pageSize: '9',
    canvas: '4',
    isOverview: 'true',
    page: '6',
    notValid: '( ͡° ͜ʖ ͡°)',
  };
  const worksRouteState = ItemRoute.fromQuery(query);

  expect(worksRouteState).toEqual({
    workId: 'm4b34tup',
    langCode: 'mul',
    sierraId: 'b1234567',
    pageSize: 9,
    canvas: 4,
    manifest: 1,
    isOverview: true,
    page: 6,
  });
});
