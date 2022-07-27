type StructuredTextProps = {
  label: string;
  allowMultipleParagraphs?: boolean;
  extraHtmlTypes?: string[];
  placeholder?: string;
  overrideDefaultHtmlTypes?: string[];
};

export default function structuredText({
  label,
  allowMultipleParagraphs = true,
  extraHtmlTypes = [],
  placeholder,
  overrideDefaultHtmlTypes,
}: StructuredTextProps) {
  // See https://prismic.io/docs/technologies/rich-text-title#json-model
  const singleOrMulti = allowMultipleParagraphs ? 'multi' : 'single';

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
