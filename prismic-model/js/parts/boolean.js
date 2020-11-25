// @flow
export default function boolean(label: string, defaultValue: boolean = false) {
  return {
    type: 'Boolean',
    config: {
      default_value: defaultValue,
      label: label,
    },
  };
}
