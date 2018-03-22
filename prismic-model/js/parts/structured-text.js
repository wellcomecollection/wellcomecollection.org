export default function description(label) {
  return {
    'type': 'StructuredText',
    'config': {
      'multi': 'paragraph, hyperlink, strong, em',
      'label': label
    }
  };
};
