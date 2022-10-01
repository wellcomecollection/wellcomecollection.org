import { multiLineText } from './text';
import title from './title';
import image from './image';

const mediaObject = {
  title,
  text: multiLineText('Text'),
  image: image('Image'),
};

export default mediaObject;
