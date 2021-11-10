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
      // This is too complicated but it's because we've overloaded this type with things like keywords.
      // See interpretation-types.abbreviation for an example.
      [singleOrMulti]: overrideDefaultHtmlTypes
        ? overrideDefaultHtmlTypes.join(',')
        : ['paragraph', 'hyperlink', 'strong', 'em']
            .concat(extraHtmlTypes)
            .join(','),
      label: label,
      placeholder,
    },
  };
}
