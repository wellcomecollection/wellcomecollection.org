// @flow
import captionedImage from './captioned-image';

export default function() {
  return {
    'type': 'Slice',
    'fieldset': 'Captioned image',
    'non-repeat': captionedImage()
  };
};
