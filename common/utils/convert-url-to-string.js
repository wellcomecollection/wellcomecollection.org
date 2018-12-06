// @flow
import {Url} from '../model/url';
export default function convertUrlToString(url: Url): string {
  const {query = {}} = url;
  const queryVals = Object.keys(query).map(key => {
    const val = query[key];
    if (val) {
      return `${key}=${val}`;
    }
  }).filter(Boolean);
  return `${url.pathname}${queryVals.length > 0 ? '?' : ''}${queryVals.join('&')}`;
}
