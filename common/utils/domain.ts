function getDomain(url: string): string {
  return new URL(url).hostname;
}

export function isExternal(url: string): boolean {
  return getDomain(document.location.href) !== getDomain(url);
}
