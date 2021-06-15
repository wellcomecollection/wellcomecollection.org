// @flow
type SingleOrMulti = 'single' | 'multi';
export default function structuredText(
  label: string,
  singleOrMulti: SingleOrMulti = 'multi',
  extraHtmlTypes: string[] = [],
  placeholder?: String,
) {
  return {
    type: 'StructuredText',
    config: {
      [singleOrMulti]: ['paragraph', 'hyperlink', 'strong', 'em']
        .concat(extraHtmlTypes)
        .join(','),
      label: label,
      placeholder
    },
  };
}
