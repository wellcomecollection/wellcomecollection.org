type TextProps = {
  label: string;
  extraTextOptions?: string[];
  overrideTextOptions?: string[];
  placeholder?: string;
};

type StructuredTextProps = TextProps & {
  allowMultipleParagraphs?: boolean;
};

const defaultTextOptions = ['paragraph', 'hyperlink', 'strong', 'em'];

function structuredText({
  label,
  allowMultipleParagraphs = true,
  extraTextOptions = [],
  overrideTextOptions = [],
  placeholder,
}: StructuredTextProps) {
  // See https://prismic.io/docs/technologies/rich-text-title#json-model
  const singleOrMulti = allowMultipleParagraphs ? 'multi' : 'single';

  if (overrideTextOptions.length > 0 && extraTextOptions.length > 0) {
    throw new Error(
      'Either specify extra text options or a complete list; not both'
    );
  }

  const textOptions =
    overrideTextOptions.length > 0
      ? overrideTextOptions.join(',')
      : [...defaultTextOptions, ...extraTextOptions].join(',');

  return {
    type: 'StructuredText',
    config: {
      // This is too complicated but it's because we've overloaded this type with things like keywords.
      // See interpretation-types.abbreviation for an example.
      [singleOrMulti]: textOptions,
      label: label,
      placeholder,
    },
  };
}

export function singleLineText(props: TextProps) {
  return structuredText({
    ...props,
    allowMultipleParagraphs: false,
  });
}

export function multiLineText(props: TextProps) {
  return structuredText({
    ...props,
    allowMultipleParagraphs: true,
  });
}
