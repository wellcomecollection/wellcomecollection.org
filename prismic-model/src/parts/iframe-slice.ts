import text from './keyword';

export default function () {
  return {
    type: 'Slice',
    fieldset: 'Iframe',
    'non-repeat': {
      iframeSrc: text('iframe src', { placeholder: 'iframe src' }),
      previewImage: {
        type: 'Image',
        config: {
          label: 'Preview image',
        },
      },
    },
  };
}
