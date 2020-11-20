type Keyable = { [key: string]: any };

// removes keys with value undefined | null associated with them
export function removeEmptyProps(obj: Record<string, unknown>): Keyable {
  return JSON.parse(
    JSON.stringify(obj, function(_, value) {
      return value === null || value === undefined ? undefined : value;
    })
  );
}

// removes keys with value undefined associated with them
export function removeUndefinedProps<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
