export function toHtmlId(s: string): string {
  return s.replace(/\W/g, '-');
}

export function removeHtmlTags(s: string): string {
  return s.replace(/<[^>]+>?/gm, '');
}
