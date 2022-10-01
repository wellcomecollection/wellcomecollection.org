type SelectProps = {
  options: string[];
  defaultValue?: string;
  placeholder?: string;
};

export default function select(
  label: string,
  { options, defaultValue, placeholder }: SelectProps
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
