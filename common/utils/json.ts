/* eslint-disable @typescript-eslint/no-explicit-any */

import { isUndefined } from './type-guards';

export function isJson(v: string): boolean {
  try {
    JSON.parse(v);
    return true;
  } catch {
    return false;
  }
}

/** The next two functions are for serialising dates via JSON.
 *
 * When we pass a Date value through getServerSideProps in Next.js, by
 * default it will be converted into a string value, but Next won't
 * hydrate it back into a Date on the other side.  This causes errors
 * in our client-side components, which expect a JavaScript Date but get
 * a string instead.
 *
 * To work around this, these two functions will:
 *
 *    1.  Replace a Date value with an object that can be safely rendered
 *        as JSON, e.g. new Date('2023-05-03T17:31:13Z') becomes
 *
 *            { "value": "2023-05-03T17:31:13Z", "type": "Date" }
 *
 *    2.  Replace any values that match that structure with JavaScript Date
 *        objects.
 *
 */
export function serialiseDates(value: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const replacer = function (key: string, value: any) {
    return this[key] instanceof Date
      ? {
          value: this[key].toUTCString(),
          type: 'Date',
        }
      : this[key];
  };

  return JSON.parse(JSON.stringify(value, replacer));
}

export function deserialiseDates(value: any) {
  const reviver = function (key: string, value: any) {
    if (
      typeof value === 'object' &&
      value !== null &&
      Object.keys(value).length === 2 &&
      Object.keys(value).includes('type') &&
      Object.keys(value).includes('value') &&
      value.type === 'Date'
    ) {
      return new Date(value.value);
    } else {
      return value;
    }
  };

  return JSON.parse(JSON.stringify(value), reviver);
}

// removes keys with value undefined associated with them
export function removeUndefinedProps<T extends Record<string, any>>(t: T): T {
  Object.keys(t).forEach((key: string) => {
    if (t[key] && typeof t[key] === 'object') {
      removeUndefinedProps(t[key]);
    } else if (isUndefined(t[key]) || t[key] === null) {
      delete t[key];
    }
  });

  return t;
}

export function serialiseProps<T extends Record<string, any>>(t: T): T {
  return serialiseDates(removeUndefinedProps(t));
}

export function deserialiseProps<T extends Record<string, any>>(t: T): T {
  return deserialiseDates(t);
}
