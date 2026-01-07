/**
 * Generic utility to strip out negated values, i.e. those starting with "!".
 * Returns both the original array (all) and the non-negated items (positiveValues)
 * N.B. We use negated values internally for exclusion filters but theyshould not be displayed in the UI.
 */
export function splitValues(values: string[]): {
  all: string[];
  positiveValues: string[];
} {
  const positiveValues = values.filter(f => !f.startsWith('!'));
  return { all: values, positiveValues };
}
