// @flow
import captionedImage from './captioned-image';
import title from './title';

export default function() {
  return {
    'type': 'Slice',
    'fieldset': 'Captioned image gallery',
    'non-repeat': {
      'title': title
    },
    'repeat': captionedImage()
  };
};
