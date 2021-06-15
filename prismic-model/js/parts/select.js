// @flow
export default function select(label: string, options: string[], defaultValue? : string, placeholder?: string) {
  return {
    type: 'Select',
    config: {
      label: label,
      options: options,
      default_value: defaultValue,
      placeholder,
    },
  };
}
