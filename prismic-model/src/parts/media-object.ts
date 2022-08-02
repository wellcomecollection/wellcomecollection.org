import { multiLineText } from './structured-text';
import title from './title';
import image from './image';

const mediaObject = {
  title,
  text: multiLineText({ label: 'Text' }),
  image: image('Image'),
};

export default mediaObject;
