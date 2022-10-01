export default function boolean(
  label: string,
  props?: { defaultValue: boolean }
) {
  return {
    type: 'Boolean',
    config: {
      default_value: props?.defaultValue || false,
      label: label,
    },
  };
}
