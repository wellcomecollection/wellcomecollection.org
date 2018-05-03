// @flow
import captionedImage from './captioned-image';
import title from './title';

export default function() {
  return {
    'type': 'Slice',
    'fieldset': 'Image gallery',
    'non-repeat': {
      'title': title
    },
    'repeat': captionedImage()
  };
};
