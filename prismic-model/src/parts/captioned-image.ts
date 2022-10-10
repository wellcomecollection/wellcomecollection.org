import { singleLineText } from './text';
import image from './image';
import boolean from './boolean';

export default function () {
  return {
    image: image('Image'),
    caption: singleLineText('Caption'),
    hasRoundedCorners: boolean('round image corners'),
  };
}
