/** If you let screen readers read out a phone number without any help,
 * they may treat the string as a number.
 *
 * For example,
 *
 *      +44 (0)20 7611 2222
 *
 * becomes
 *
 *      plus forty-four zero two zero seven six one one two-thousand two hundred and twenty-two
 *
 * This function creates an aria-label that breaks the numbers into individual
 * characters, e.g. '+ 4 4 0 2 0 7 6 1 1 2 2 2 2', so that it's read in
 * a more sensible way:
 *
 *      plus four four zero two zero seven six one one two two two two
 *
 * See https://jhalabi.com/blog/accessibility-phone-number-formatting
 *
 */
export function createScreenreaderLabel(number: string): string {
  // See https://jhalabi.com/blog/accessibility-phone-number-formatting
  //
  // We remove everything except the plus and numerals, then we add spaces
  // between them so the screen reader will treat them as separate digits.
  //
  // The full stops tell the screen reader to pause between groups, e.g.
  //
  //    plus four four (pause) zero two zero (pause) seven six one one
  //
  // which is closer to how a human would read the number.
  return Array.from(number.replaceAll(' ', '.'))
    .filter(c => c === '+' || c === '.' || (c >= '0' && c <= '9'))
    .join(' ')
    .replaceAll(' .', '.');
}
