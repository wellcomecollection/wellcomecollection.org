type Props = { placeholder: string };

export default function number(
  label: string,
  props?: Props
): Record<string, unknown> {
  return {
    type: 'Number',
    config: {
      label,
      placeholder: props?.placeholder,
    },
  };
}
