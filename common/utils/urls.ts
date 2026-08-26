export function appendQueryParam(
  url: string,
  key: string,
  value: string
): string {
  const isAbsolute = /^[a-z][a-z\d+.-]*:/i.test(url);
  const parsed = new URL(url, isAbsolute ? undefined : 'http://placeholder');
  parsed.searchParams.set(key, value);

  return isAbsolute ? parsed.toString() : `${parsed.pathname}${parsed.search}`;
}
