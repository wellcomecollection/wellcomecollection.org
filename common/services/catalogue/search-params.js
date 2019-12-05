// @flow
import Router from 'next/router';
import {
  type Serialisers,
  type Deserialisers,
  type QueryStringParameterMapping,
  booleanDeserialiser,
  stringDeserialiser,
  nullableNumberDeserialiser,
  nullableStringDeserialiser,
  nullableCsvDeserialiser,
  stringSerialiser,
  numberWithDefaultSerialiser,
  numberSerialiser,
  nullableCsvSerialiser,
  nullableStringSerialiser,
  csvWithDefaultSerialiser,
  nullableDateStringSerialiser,
  booleanSerialiser,
  buildDeserialiser,
  buildSerialiser,
} from './params';

export type SearchParams = {|
  query: string,
  page: ?number,
  workType: ?(string[]),
  itemsLocationsLocationType: ?(string[]),
  sort: ?string,
  sortOrder: ?string,
  productionDatesFrom: ?string,
  productionDatesTo: ?string,
  aggregations: ?(string[]),
  _queryType: ?string,
  imageSearch: boolean,
|};

type ApiSearchParamsSerialisers = Serialisers<SearchParams>;
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

const deserialisers: SearchParamsDeserialisers = {
  query: stringDeserialiser,
  page: nullableNumberDeserialiser,
  workType: nullableCsvDeserialiser,
  itemsLocationsLocationType: nullableCsvDeserialiser,
  sort: nullableStringDeserialiser,
  sortOrder: nullableStringDeserialiser,
  aggregations: nullableCsvDeserialiser,
  productionDatesFrom: nullableStringDeserialiser,
  productionDatesTo: nullableStringDeserialiser,
  _queryType: nullableStringDeserialiser,
  imageSearch: booleanDeserialiser,
};

const serialisers: SearchParamsDeserialisers = {
  query: stringSerialiser,
  page: numberSerialiser,
  workType: nullableCsvSerialiser,
  itemsLocationsLocationType: nullableCsvSerialiser,
  sort: nullableStringSerialiser,
  sortOrder: nullableStringSerialiser,
  aggregations: nullableCsvSerialiser,
  productionDatesFrom: nullableStringSerialiser,
  productionDatesTo: nullableStringSerialiser,
  _queryType: nullableStringSerialiser,
  imageSearch: booleanSerialiser,
};

const apiSerialisers: ApiSearchParamsSerialisers = {
  query: stringSerialiser,
  page: numberWithDefaultSerialiser(1),
  workType: csvWithDefaultSerialiser(defaultWorkTypes),
  itemsLocationsLocationType: csvWithDefaultSerialiser(
    defaultItemsLocationsLocationType
  ),
  sort: nullableStringSerialiser,
  sortOrder: nullableStringSerialiser,
  aggregations: nullableCsvSerialiser,
  productionDatesFrom: nullableDateStringSerialiser,
  productionDatesTo: nullableDateStringSerialiser,
  _queryType: nullableStringSerialiser,
};

const unFilteredApiSerialisers: ApiSearchParamsSerialisers = {
  ...apiSerialisers,
  workType: nullableCsvSerialiser,
  itemsLocationsLocationType: nullableCsvSerialiser,
};

export const searchParamsSerialiser = buildSerialiser(
  serialisers,
  propToQueryStringMapping
);

export const searchParamsDeserialiser = buildDeserialiser(
  deserialisers,
  propToQueryStringMapping
);

export const apiSearchParamsSerialiser = buildSerialiser(
  apiSerialisers,
  propToQueryStringMapping
);

export const unfilteredApiSearchParamsSerialiser = buildSerialiser(
  unFilteredApiSerialisers,
  propToQueryStringMapping
);

export function clientSideSearchParams(): SearchParams {
  const obj = typeof window !== 'undefined' ? Router.query : {};
  return searchParamsDeserialiser(obj);
}
