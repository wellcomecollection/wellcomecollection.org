// @Flow

// Defaults are used when null is supplied
// This is used because we want null to be displayed on in the URL for things we are actually
// filtering on the API such as `workType`
type Deserialiser<T> = (input: ?string) => T;
type Serialiser<T> = (input: T) => ?string;
type DeserialiserWithDefaults<T> = (defaults: T) => Deserialiser<T>;
type SerializerWithDefaults<T> = (defaults: T) => Serialiser<T>;
export type Deserialisers<T> = $Exact<
  $ObjMap<T, <V>() => (input: ?string) => V>
>;
export type Serialisers<T> = $Exact<$ObjMap<T, <V>() => (input: V) => ?string>>;
export type QueryStringParameterMapping = { [string]: string };

// Default serialisers and deserialisers
const stringDeserialiser: Deserialiser<string> = input => input || '';
const numberDeserialiser: Deserialiser<number> = input =>
  input ? parseInt(input) : 1;
const csvDeserialiser: Deserialiser<?(string[])> = input => {
  return input ? input.split(',') : [];
};
const nullableStringDeserialiser: Deserialiser<?string> = input => input;
const booleanDeserialiser: Deserialiser<boolean> = input => input === 'true';
const csvWithDefaultDeserialiser: DeserialiserWithDefaults<
  string[]
> = defaults => input =>
  input === '' ? [] : input ? input.split(',', -1) : defaults;

const stringSerialiser: Serialiser<string> = input =>
  input === '' ? null : input;
const numberSerialiser: Serialiser<number> = input =>
  input === 1 || !input ? null : input.toString();
const csvSerialiser: Serialiser<?(string[])> = input =>
  input && input.length > 0 ? input.join(',') : null;
const nullableStringSerialiser: Serialiser<?string> = input => input;
const booleanSerialiser: Serialiser<boolean> = input =>
  input === true ? 'true' : null;
const csvWithDefaultSerialiser: SerializerWithDefaults<?(string[])> = defaults => (
  input = defaults
) => {
  if (!input) {
    return defaults.join(',');
  }
  // This only works with single dimension values, which is fine for here
  const areEqual =
    input.length === defaults.length && input.every(i => defaults.includes(i));

  return areEqual ? null : input.join(',');
};

function buildDeserialiser<T>(deserialisers: Deserialisers<T>) {
  return (obj: Object): T => {
    const keys = Object.keys(deserialisers);
    const searchParams = keys.reduce((acc, key) => {
      const input = key in obj ? obj[key] : null;

      return {
        ...acc,
        [key]: deserialisers[key](input, key),
      };
    }, {});

    // TODO: Need to find why this, by Flow's standards, could be returning a `{}`
    // $FlowFixMe
    return searchParams;
  };
}

type SerialisedParams = { [key: string]: ?string };
function buildSerialiser<T>(
  serialisers: Serialisers<T>,
  queryStringParameterMapping: QueryStringParameterMapping,
  isForUrl?: boolean
) {
  return (searchParams: T): SerialisedParams => {
    const keys = Object.keys(serialisers);

    // $FlowFixMe
    const urlParams = keys.reduce((acc, key) => {
      const input = searchParams[key] ? searchParams[key] : null;
      const urlParam =
        queryStringParameterMapping[key] && !isForUrl
          ? queryStringParameterMapping[key]
          : key;

      return {
        ...acc,
        [urlParam]: serialisers[key](input),
      };
    }, {});
    return urlParams;
  };
}

export {
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
};
