export default function number(
  label: string,
  placeholder?: string
): Record<string, unknown> {
  return {
    type: 'Number',
    config: {
      label: label,
      placeholder: placeholder,
    },
  };
}
