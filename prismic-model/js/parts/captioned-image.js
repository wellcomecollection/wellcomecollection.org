// @flow
import structuredText from './structured-text';
import image from './image';

export default function() {
  return {
    'caption': structuredText('Caption', 'single'),
    'image': image('Image')
  };
}
