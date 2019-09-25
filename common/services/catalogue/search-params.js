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

export const defaultWorkTypes = ['a', 'k', 'q', 'v', 'f', 's'];
export const defaultItemsLocationsLocationType = [
  'iiif-image',
  'iiif-presentation',
];

const queryStringParameterMapping: QueryStringParameterMapping = {
  itemsLocationsLocationType: 'items.locations.locationType',
  productionDatesFrom: 'production.dates.from',
  productionDatesTo: 'production.dates.to',
};

const deserialisers: SearchParamsDeserialisers = {
  query: stringDeserialiser,
  page: numberDeserialiser,
  workType: csvWithDefaultDeserialiser(defaultWorkTypes),
  itemsLocationsLocationType: csvWithDefaultDeserialiser(
    defaultItemsLocationsLocationType
  ),
  sort: nullableStringDeserialiser,
  sortOrder: nullableStringDeserialiser,
  aggregations: csvDeserialiser,
  productionDatesFrom: nullableStringDeserialiser,
  productionDatesTo: nullableStringDeserialiser,
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
  productionDatesFrom: nullableStringSerialiser,
  productionDatesTo: nullableStringSerialiser,
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
};

export const searchParamsDeserialiser = buildDeserialiser(deserialisers);
export const searchParamsSerialiser = buildSerialiser(
  serialisers,
  queryStringParameterMapping
);

export const searchParamsSerialiserForUrl = buildSerialiser(
  serialisers,
  queryStringParameterMapping,
  true
);

export const apiSearchParamsSerialiser = buildSerialiser(
  apiSerialisers,
  queryStringParameterMapping
);

export function clientSideSearchParams(): SearchParams {
  const obj = typeof window !== 'undefined' ? Router.query : {};
  return searchParamsDeserialiser(obj);
}
