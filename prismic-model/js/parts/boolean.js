// @flow

export default function(label: string, defaultValue: boolean = false) {
  return {
    type: 'Boolean',
    config: {
      default_value: defaultValue,
      label: label,
    },
  };
}
