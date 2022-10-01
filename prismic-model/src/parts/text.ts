type TextProps =
  | {
      extraTextOptions?: string[];
      placeholder?: string;
    }
  | {
      overrideTextOptions?: string[];
      placeholder?: string;
    };

type StructuredTextProps = TextProps & {
  label: string;
  allowMultipleParagraphs?: boolean;
};

const defaultTextOptions = ['paragraph', 'hyperlink', 'strong', 'em'];

function structuredText({
  label,
  allowMultipleParagraphs = true,
  placeholder,
  ...props
}: StructuredTextProps) {
  // See https://prismic.io/docs/technologies/rich-text-title#json-model
  const singleOrMulti = allowMultipleParagraphs ? 'multi' : 'single';

  const textOptions =
    'overrideTextOptions' in props
      ? props.overrideTextOptions.join(',')
      : 'extraTextOptions' in props
      ? [...defaultTextOptions, ...props.extraTextOptions].join(',')
      : [...defaultTextOptions].join(',');

  return {
    type: 'StructuredText',
    config: {
      // This is too complicated but it's because we've overloaded this type with things like keywords.
      // See interpretation-types.abbreviation for an example.
      [singleOrMulti]: textOptions,
      label,
      placeholder,
    },
  };
}

export function singleLineText(label: string, props?: TextProps) {
  return structuredText({
    label,
    ...props,
    allowMultipleParagraphs: false,
  });
}

export function multiLineText(label: string, props?: TextProps) {
  return structuredText({
    label,
    ...props,
    allowMultipleParagraphs: true,
  });
}
