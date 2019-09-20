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
  booleanDeserialiser,
  csvWithDefaultDeserialiser,
  stringSerialiser,
  numberSerialiser,
  csvSerialiser,
  nullableStringSerialiser,
  booleanSerialiser,
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
  _isFilteringBySubcategory: ?boolean,
|};

type SearchParamsSerialisers = Serialisers<SearchParams>;
type SearchParamsDeserialisers = Deserialisers<SearchParams>;

const defaultWorkTypes = ['a', 'k', 'q', 'v', 'f', 's'];
const defaultItemsLocationsLocationType = ['iiif-image', 'iiif-presentation'];
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
  _isFilteringBySubcategory: booleanDeserialiser,
};

const serialisers: SearchParamsSerialisers = {
  query: stringSerialiser,
  page: numberSerialiser,
  workType: csvWithDefaultSerialiser(defaultWorkTypes),
  itemsLocationsLocationType: csvWithDefaultSerialiser(
    defaultItemsLocationsLocationType
  ),
  sort: nullableStringSerialiser,
  sortOrder: nullableStringSerialiser,
  aggregations: csvSerialiser,
  productionDatesFrom: nullableStringSerialiser,
  productionDatesTo: nullableStringSerialiser,
  _queryType: nullableStringSerialiser,
  _isFilteringBySubcategory: booleanSerialiser,
};

export const searchParamsDeserialiser = buildDeserialiser(deserialisers);
export const searchParamsSerialiser = buildSerialiser(
  serialisers,
  queryStringParameterMapping
);

export function searchQueryParams(): SearchParams {
  const obj = typeof window !== 'undefined' ? Router.query : {};
  return searchParamsDeserialiser(obj);
}
