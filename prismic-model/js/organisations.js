// @flow
import text from './parts/text';
import description from './parts/description';
import image from './parts/image';
import list from './parts/list';
import title from './parts/title';
import heading from './parts/heading';

export default {
  Organisation: {
    name: title,
    description: description,
    image: image('Image'),
    sameAs: list('Same as', {
      link: text('Link'),
      title: heading('Title (override)')
    }),
    url: text('URL (deprecated)')
  }
};
