/**
 * Checks if a filter value is negated (i.e., starts with '!')
 * Negated values are used internally for exclusion filters but should
 * not be displayed in the UI.
 */
export const isNegatedValue = (value: string): boolean => {
  return value.startsWith('!');
};
