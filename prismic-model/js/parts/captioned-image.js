// @flow
import structuredText from './structured-text';
import image from './image';

export default function() {
  return {
    'image': image('Image'),
    'caption': structuredText('Caption', 'single')
  };
}
