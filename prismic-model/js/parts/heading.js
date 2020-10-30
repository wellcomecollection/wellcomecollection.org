// @flow
export default function heading(
  label: string = 'Title',
  headingLevel?: 1 | 2 | 3 = 1
) {
  return {
    type: 'StructuredText',
    config: {
      label: label,
      single: `heading${headingLevel}`,
    },
  };
}
