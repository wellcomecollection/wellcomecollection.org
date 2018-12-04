// @flow
// I'm sure we don't need to do this still?
export default function convertLinkToString(url): string {
  const {query = {}} = url;
  const queryVals = Object.keys(query).map(key => {
    const val = query[key];
    if (val) {
      return `${key}=${val}`;
    }
  }).filter(Boolean);
  return `${url.pathname}${queryVals.length > 0 ? '?' : ''}${queryVals.join('&')}`;
}
