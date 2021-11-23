export function toHtmlId(s: string): string {
  return s.replace(/\W/g, '-');
}

export function removeIdiomaticTextTags(s: string): string {
  return s.replace(/<\/?[iI]>/gm, '');
}
