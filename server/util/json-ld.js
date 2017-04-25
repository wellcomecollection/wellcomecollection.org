// @flow
export function objToJsonLd<T>(obj: T, type: string, root: boolean = true) {
  const jsonObj = JSON.parse(JSON.stringify(obj));
  const jsonLdAddition = root ? {
    '@context': 'http://schema.org',
    '@type': type
  } : { '@type': type };
  return Object.assign({}, jsonObj, jsonLdAddition);
}
