import { isUndefined } from './array';

type Keyable = { [key: string]: any };

export function isJson(v: string): boolean {
  try {
    JSON.parse(v);
    return true;
  } catch (e) {
    return false;
  }
}

// removes keys with value undefined | null associated with them
export function removeEmptyProps(obj: Record<string, unknown>): Keyable {
  return JSON.parse(
    JSON.stringify(obj, function (_, value) {
      return value === null || value === undefined || value === ''
        ? undefined
        : value;
    })
  );
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
