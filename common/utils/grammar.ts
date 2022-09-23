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

export function dasherizeShorten(words: string): string[] {
  return words
    .split(' ')
    .slice(0, 4)
    .join(' ')
    .trim()
    .toLowerCase()
    .replace(/\W/g, '-')
    .split(/[.*:/()]/);
}
