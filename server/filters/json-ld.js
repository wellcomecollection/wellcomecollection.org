// @flow
export default function jsonLd<T>(obj: T, type: string) {
  const o = objToJsonLd(obj, type);
  return JSON.stringify(o);
}

function objToJsonLd<T>(obj: T, type: string) {
  const jsonObj = JSON.parse(JSON.stringify(obj));
  const jsonLdAddition = {
    '@context': 'http://schema.org',
    '@type': type,
  };
  return Object.assign({}, jsonObj, jsonLdAddition);
}
