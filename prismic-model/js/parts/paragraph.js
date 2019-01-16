// @flow
export default function paragraph(label: string = 'Text') {
  return  {
    'type': 'StructuredText',
    'config': {
      'label': label,
      'single': 'paragraph'
    }
  };
}
