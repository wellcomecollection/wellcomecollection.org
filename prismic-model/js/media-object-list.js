import structuredText from './parts/structured-text';
import title from './parts/title';
import image from './parts/image';

const mediaObjectList = {
  Main: {
    title,
    text: structuredText('Text', 'multi'),
    image: image('Image'),
  },
};

export default mediaObjectList;
