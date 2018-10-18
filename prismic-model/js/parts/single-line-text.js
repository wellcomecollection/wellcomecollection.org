// @flow
export default function heading(label: string = 'Title') {
  return  {
    'type': 'StructuredText',
    'config': {
      'label': label,
      'single': 'paragraph'
    }
  };
}
