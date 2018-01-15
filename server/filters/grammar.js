// @flow
type AOrAn = 'a' | 'an';
export function aOrAn(string: string): AOrAn {
  return 'aeiou'.indexOf(string.charAt(0).toLowerCase()) !== -1 ? 'an' : 'a';
}
