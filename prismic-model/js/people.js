// @flow
import text from './parts/text';
import description from './parts/description';
import image from './parts/image';

export default {
  Person: {
    name: text('Full name'),
    description: description,
    image: image('Image'),
    twitterHandle: text('Twitter handle')
  }
};
