// @flow
export default function structuredText (label: string) {
  return {
    'type': 'StructuredText',
    'config': {
      'multi': 'paragraph, hyperlink, strong, em',
      'label': label
    }
  };
};
