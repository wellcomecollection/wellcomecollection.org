export function getDomain(url: string): string {
  return url
    .replace('http://', '')
    .replace('https://', '')
    .split('/')[0];
}

export function isExternal(url: string): boolean {
  return getDomain(document.location.href) !== getDomain(url);
}
