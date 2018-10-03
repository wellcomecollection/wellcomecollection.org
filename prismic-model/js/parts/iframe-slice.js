import text from './text';

export default function() {
  return {
    'type': 'Slice',
    'fieldset': 'Iframe',
    'non-repeat': {
      iframeSrc: text('iframe src', 'iframe src'),
      previewImage: {
        'type': 'Image',
        'config': {
          'label': 'Preview image'
        }
      }
    }
  };
};
