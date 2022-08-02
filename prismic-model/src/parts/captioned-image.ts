import { singleLineText } from './structured-text';
import image from './image';

export default function () {
  return {
    image: image('Image'),
    caption: singleLineText({ label: 'Caption' }),
  };
}
