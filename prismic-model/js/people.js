// @flow
import text from './parts/text';
import description from './parts/description';
import image from './parts/image';
import list from './parts/list';
import heading from './parts/paragraph';

export default {
  Person: {
    name: text('Full name'),
    description: description,
    image: image('Image'),
    sameAs: list('Same as', {
      link: text('Link'),
      title: heading('Link text')
    })
  }
};
