type SingleOrMulti = 'single' | 'multi';
export default function structuredText(
  label: string,
  singleOrMulti: SingleOrMulti = 'multi',
  extraHtmlTypes: string[] = [],
  placeholder?: string,
  overrideDefaultHtmlTypes?: string[]
) {
  return {
    type: 'StructuredText',
    config: {
      [singleOrMulti]:
        overrideDefaultHtmlTypes ??
        ['paragraph', 'hyperlink', 'strong', 'em']
          .concat(extraHtmlTypes)
          .join(','),
      label: label,
      placeholder,
    },
  };
}
