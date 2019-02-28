// @flow
export default function heading(
  label: string = 'Title',
  type: ?string = 'paragraph'
) {
  return {
    type: 'StructuredText',
    config: {
      label: label,
      single: type,
    },
  };
}
