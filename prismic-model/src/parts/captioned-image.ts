import { singleLineText } from './structured-text';
import image from './image';
import boolean from './boolean';

export default function () {
  return {
    image: image('Image'),
    caption: singleLineText({ label: 'Caption' }),
    hasRoundedCorners: boolean('round image corners'),
  };
}
