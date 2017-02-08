// @flow
import {objToJsonLd} from '../util/json-ld';

export default function jsonLd<T>(obj: T, type: string) {
  const o = objToJsonLd(obj, type);
  return JSON.stringify(o);
}

