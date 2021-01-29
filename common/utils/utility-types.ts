// This will convert optional parameters in a type to required, but undefineable
// e.g. { required: string, optional?: string } => { required: string, optional: string | undefined }
// This is useful for when you want to expose the type,
// but have the implementation express all properties if if the = undefined
// A nice read on why we need the `keyof never` to make it homomorphic
// see: https://stackoverflow.com/questions/59790508/what-does-homomorphic-mapped-type-mean/59791889#59791889
export type OptionalToUndefined<T> = {
  [P in keyof T & keyof never]: T[P];
};
