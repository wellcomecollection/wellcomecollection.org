// @flow
import * as parsers from '../util/json-ld';

export default function jsonLd<T>(obj: T, parserName: string) {
  const o = parsers[parserName](obj);
  return JSON.stringify(o);
}
