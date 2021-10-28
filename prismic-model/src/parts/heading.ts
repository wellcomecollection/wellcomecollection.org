export default function heading(label = 'Title', headingLevel: 1 | 2 | 3 = 1) {
  return {
    type: 'StructuredText',
    config: {
      label: label,
      single: `heading${headingLevel}`,
    },
  };
}
