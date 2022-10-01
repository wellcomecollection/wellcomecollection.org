export default function select(
  label: string,
  options: string[],
  defaultValue?: string,
  placeholder?: string
) {
  return {
    type: 'Select',
    config: {
      label,
      options,
      default_value: defaultValue,
      placeholder,
    },
  };
}
