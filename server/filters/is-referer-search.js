export function isRefererSearch(referer, requestOrigin) {
  return referer !== undefined && referer.split('?')[0] === requestOrigin + '/search';
}
