export function capitalize(word: string): string {
  const [firstLetter] = word;
  const restOfWord = word.slice(1);

  return `${firstLetter.toUpperCase()}${restOfWord}`;
}

export function camelize(title: string): string {
  const titleArray = title.toLowerCase().split(/-|_| /);

  return titleArray.reduce((acc, val, i) => {
    const alphanumericVal = val.replace(/\W/g, '');

    if (i === 0) {
      return alphanumericVal;
    } else {
      return (
        acc + alphanumericVal.charAt(0).toUpperCase() + alphanumericVal.slice(1)
      );
    }
  }, '');
}

export function dasherize(words: string): string {
  return words.trim().toLowerCase().replace(/\W/g, '-');
}
// Take a string, like Tombstone title, and return first four words, in lowercase, with dashes
// An id from Exhibition Guide Tombstone title e.g. An eye surgeon operating on a man
// becomes #an-eye-surgeon-operating
export function dasherizeShorten(words: string): string {
  return words
    .split(' ')
    .slice(0, 4)
    .join(' ')
    .toLowerCase()
    .replace(/\W/g, '-');
}

/** Formats a number with commas for readability, e.g.
 *
 *            1 =>         1
 *           10 =>        10
 *         1942 =>     1,942
 *      1234567 => 1,234,567
 *
 * If isCompact is set to true, it sets it to a compact format by rounding it up, e.g.
 *
 *         1942 =>     1.9K
 *      1194567 =>     1.2M
 */
export function formatNumber(
  n: number,
  options?: { isCompact: boolean }
): string {
  const format = options?.isCompact
    ? new Intl.NumberFormat('en-GB', {
        notation: 'compact',
      })
    : new Intl.NumberFormat('en-GB');

  return format.format(n);
}

/** Formats a string to describe a list of results, e.g.
 *
 *      1 work
 *      5 images
 *      100 events
 *
 */
export function pluralize(count: number, noun: string, suffix = 's'): string {
  return `${formatNumber(count)} ${noun}${count !== 1 ? suffix : ''}`;
}

export function camelToKebab(words: string): string {
  return words
    .split(/(?=[A-Z])/)
    .join('-')
    .toLowerCase();
}
