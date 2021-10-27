import structuredText from './structured-text';
import title from './title';
import image from './image';

const mediaObject = {
  title,
  text: structuredText('Text', 'multi'),
  image: image('Image'),
};

export default mediaObject;
