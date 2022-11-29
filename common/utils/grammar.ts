export function capitalize(word: string): string {
  const [firstLetter] = word;
  const restOfWord = word.slice(1);

  return `${firstLetter.toUpperCase()}${restOfWord}`;
}

export function camelize(title: string): string {
  const titleArray = title.toLowerCase().split(/-|_| /);

  return titleArray.reduce((acc, val, i) => {
    if (i === 0) {
      return val;
    } else {
      return acc + val.charAt(0).toUpperCase() + val.slice(1);
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

export function pluralize(count: number, noun: string, suffix = 's'): string {
  return `${count} ${noun}${count !== 1 ? suffix : ''}`;
}

export function unCamelCase(words: string): string {
  return words.split(/(?=[A-Z])/).join(' ');
}
