export function quoteVal(val: string): string {
  return `"${val.replace(/"/g, `\\"`)}"`;
}

export function parseCsv(value: string): string[] {
  return (CSVtoArray(value) || ([] as unknown)) as string[];
}

// Adapted from https://stackoverflow.com/a/8497474
function CSVtoArray(value: string): string[] {
  const reValid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
  const reValue = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;

  // Return a single item the whole value in if not valid
  if (!reValid.test(value)) {
    return [value];
  }

  const a: string[] = [];
  value.replace(
    reValue,
    (
      m0,
      m1: string | undefined,
      m2: string | undefined,
      m3: string | undefined
    ) => {
      // Remove backslash from \' in single quoted values.
      if (m1 !== undefined) {
        a.push(m1.replace(/\\'/g, "'"));
      }
      // Remove backslash from \" in double quoted values.
      else if (m2 !== undefined) {
        a.push(m2.replace(/\\"/g, '"'));
      } else if (m3 !== undefined) {
        a.push(m3);
      }
      return ''; // Return empty string.
    }
  );

  // Handle special case of empty last value.
  if (/,\s*$/.test(value)) {
    a.push('');
  }
  return a;
}
