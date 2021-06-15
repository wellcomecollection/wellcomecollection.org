// @flow
type SingleOrMulti = 'single' | 'multi';
type Props = {|
  label: string,
  singleOrMulti: SingleOrMulti,
  htmlTypes: string[],
  placeholder?: string,
  useAsTitle?: boolean,
|}

export default function specificStructuredText({
  label,
  singleOrMulti,
  htmlTypes,
  placeholder,
  useAsTitle,
}) {
  return {
    type: 'StructuredText',
    config: {
      [singleOrMulti]: htmlTypes.join(','),
      label: label,
      placeholder: placeholder,
      useAsTitle: useAsTitle,
    },
  };
}
