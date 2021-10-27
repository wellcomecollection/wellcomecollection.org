export default function heading(label = 'Title', type = 'paragraph') {
  return {
    type: 'StructuredText',
    config: {
      label: label,
      single: type,
    },
  };
}
