function commonPrefix(s1: string, s2: string): string {
  // Find the position of the first character where the two strings
  // don't match, then take everything before that point.
  //
  // If there are no mismatches, then the strings are identical up
  // to the length of s1.
  const firstMismatch = [...Array(s1.length).keys()].find(i => s1[i] !== s2[i]);

  return firstMismatch === 0
    ? ''
    : firstMismatch
    ? s1.slice(0, firstMismatch)
    : s1;
}

function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) {
    return '';
  }

  return strings.reduce(
    (longestPrefix, s) => commonPrefix(longestPrefix, s),
    strings[0]
  );
}

function reverse(s: string): string {
  return s.split('').reverse().join('');
}

function longestCommonSuffix(strings: string[]): string {
  const reversedStrings = strings.map(reverse);

  return reverse(longestCommonPrefix(reversedStrings));
}

export type CommonParts = {
  prefix: string;
  suffix: string;
  remainingStrings: string[];
};

export function findLongestCommonParts(strings: string[]): CommonParts {
  const prefix = longestCommonPrefix(strings);

  const unprefixedStrings = strings.map(s => s.slice(prefix.length, s.length));

  const suffix = longestCommonSuffix(unprefixedStrings);

  return { prefix, suffix };
}
