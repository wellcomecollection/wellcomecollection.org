/** This file contains some functions for compressing long arrays of similar strings.
 *
 * It works by extracting common prefixes/suffixes and storing them once.
 *
 * For example:
 *
 *      names = ['example1.jpg', 'example2.jpg', 'example3.jpg', ..., 'example1000.jpg']
 *
 *      toCommonParts(names)
 *      # {
 *      #  prefix: 'example',
 *      #  suffix: '.jpg',
 *      #  remainders: ['1', '2', '3', ..., '1000']
 *      # }
 *
 *      fromCommonParts({ prefix: 'example', suffix: '.jpg', remainders: ['1', '2', ..., '1000'] })
 *      # ['example1.jpg', 'example2.jpg', 'example3.jpg', ..., 'example1000.jpg']
 *
 */

import { isNotUndefined } from './type-guards';

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
  remainders: (string | undefined)[];
};

export function toCommonParts(strings: (string | undefined)[]): CommonParts {
  // Implementation note: it's important to strip the prefix _before_ you
  // look for the common suffix – otherwise when the list has a single string,
  // you'll get prefix == suffix == original string, which will cause issues
  // when you come to rebuild the original list.
  const prefix = longestCommonPrefix(strings.filter(isNotUndefined));
  const unprefixedStrings = strings.map(s =>
    s ? s.slice(prefix.length, s.length) : undefined
  );
  const suffix = longestCommonSuffix(unprefixedStrings.filter(isNotUndefined));

  return {
    prefix,
    suffix,
    remainders: strings.map(s =>
      s ? removeCommonParts(s, { prefix, suffix }) : undefined
    ),
  };
}

function removeCommonParts(
  s: string,
  { prefix, suffix }: { prefix: string; suffix: string }
): string {
  return s.slice(prefix.length, s.length - suffix.length);
}

export function fromCommonParts(
  commonParts: CommonParts
): (string | undefined)[] {
  return commonParts.remainders.map(r =>
    isNotUndefined(r) ? commonParts.prefix + r + commonParts.suffix : undefined
  );
}
