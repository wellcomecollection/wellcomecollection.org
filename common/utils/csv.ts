export function quoteVal(val: string): string {
  return `"${val.replace(/"/g, `\\"`)}"`;
}
