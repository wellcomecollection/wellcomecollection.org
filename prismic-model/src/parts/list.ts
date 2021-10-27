export default function list(label: string, fields: Record<string, unknown>) {
  return {
    type: 'Group',
    fieldset: label,
    config: {
      fields,
    },
  };
}
