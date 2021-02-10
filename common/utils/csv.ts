import Papa from 'papaparse';

export function quoteVal(val: string): string {
  return `"${val.replace(/"/g, `\\"`)}"`;
}

export function parseCsv(value: string): string[] {
  return Papa.parse(value, {
    quoteChar: '"',
    escapeChar: '\\',
    delimiter: ',',
    worker: false,
    header: true,
  }).data[0] as string[];
}
