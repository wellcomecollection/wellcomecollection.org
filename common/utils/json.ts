type Keyable = { [key: string]: any };

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

// https://github.com/vercel/next.js/discussions/11209#discussioncomment-38480
function deleteUndefined<T extends Record<string, any>>(obj: T): T {
  if (obj) {
    Object.keys(obj).forEach((key: string) => {
      if (obj[key] && typeof obj[key] === 'object') {
        deleteUndefined(obj[key]);
      } else if (typeof obj[key] === 'undefined') {
        delete obj[key];
      }
    });
  }
}

// removes keys with value undefined associated with them
export function removeUndefinedProps<T extends Record<string, any>>(obj: T): T {
  deleteUndefined(obj);
  return obj;
}
