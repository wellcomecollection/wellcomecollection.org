export function toHtmlId(s: string): string {
  return s.replace(/\W/g, '-');
}
