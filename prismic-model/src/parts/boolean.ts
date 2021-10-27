export default function boolean(label: string, defaultValue = false) {
  return {
    type: 'Boolean',
    config: {
      default_value: defaultValue,
      label: label,
    },
  };
}
