// @flow
import Router from 'next/router';
import {
  type Serialisers,
  type Deserialisers,
  type QueryStringParameterMapping,
  stringDeserialiser,
  numberDeserialiser,
  csvDeserialiser,
  nullableStringDeserialiser,
  csvWithDefaultDeserialiser,
  stringSerialiser,
  numberSerialiser,
  csvSerialiser,
  nullableStringSerialiser,
  csvWithDefaultSerialiser,
  nullableDateStringSerialiser,
  buildDeserialiser,
  buildSerialiser,
} from './params';

export type SearchParams = {|
  query: string,
  page: number,
  workType: ?(string[]),
  itemsLocationsLocationType: ?(string[]),
  sort: ?string,
  sortOrder: ?string,
  productionDatesFrom: ?string,
  productionDatesTo: ?string,
  aggregations: ?(string[]),
  _queryType: ?string,
|};

type SearchParamsSerialisers = Serialisers<SearchParams>;
type SearchParamsDeserialisers = Deserialisers<SearchParams>;

export const defaultWorkTypes = ['a', 'k', 'q'];
export const defaultItemsLocationsLocationType = [
  'iiif-image',
  'iiif-presentation',
];

const propToQueryStringMapping: QueryStringParameterMapping = {
  itemsLocationsLocationType: 'items.locations.locationType',
  productionDatesFrom: 'production.dates.from',
  productionDatesTo: 'production.dates.to',
};

const queryStringToPropMapping: QueryStringParameterMapping = Object.entries(
  propToQueryStringMapping
  // $FlowFixMe
).reduce((obj, [key, value]) => ({ ...obj, [value]: key }), {});

const deserialisers: SearchParamsDeserialisers = {
  query: stringDeserialiser,
  page: numberDeserialiser,
  workType: csvWithDefaultDeserialiser(defaultWorkTypes),
  [`items.locations.locationType`]: csvWithDefaultDeserialiser(
    defaultItemsLocationsLocationType
  ),
  sort: nullableStringDeserialiser,
  sortOrder: nullableStringDeserialiser,
  aggregations: csvDeserialiser,
  [`production.dates.from`]: nullableStringDeserialiser,
  [`production.dates.to`]: nullableStringDeserialiser,
  _queryType: nullableStringDeserialiser,
};

const apiSerialisers: SearchParamsSerialisers = {
  query: stringSerialiser,
  page: numberSerialiser,
  workType: csvWithDefaultSerialiser([]),
  itemsLocationsLocationType: csvWithDefaultSerialiser([]),
  sort: nullableStringSerialiser,
  sortOrder: nullableStringSerialiser,
  aggregations: csvSerialiser,
  productionDatesFrom: nullableDateStringSerialiser,
  productionDatesTo: nullableDateStringSerialiser,
  _queryType: nullableStringSerialiser,
};

// We do a few things differently this side, including havein UI params
// And also not showing certain filters when they are actually applied e.g. workType
const serialisers: SearchParamsSerialisers = {
  ...apiSerialisers,
  workType: csvWithDefaultSerialiser(defaultWorkTypes),
  itemsLocationsLocationType: csvWithDefaultSerialiser(
    defaultItemsLocationsLocationType
  ),
  productionDatesFrom: nullableStringSerialiser,
  productionDatesTo: nullableStringSerialiser,
};

export const searchParamsDeserialiser = buildDeserialiser(
  deserialisers,
  queryStringToPropMapping
);
export const searchParamsSerialiser = buildSerialiser(
  serialisers,
  propToQueryStringMapping
);

export const apiSearchParamsSerialiser = buildSerialiser(
  apiSerialisers,
  propToQueryStringMapping
);

export function clientSideSearchParams(): SearchParams {
  const obj = typeof window !== 'undefined' ? Router.query : {};
  return searchParamsDeserialiser(obj);
}
