// @flow
import text from './parts/text';
import description from './parts/description';
import image from './parts/image';
import list from './parts/list';
import heading from './parts/heading';

export default {
  Person: {
    name: text('Full name'),
    description: description,
    image: image('Image'),
    sameAs: list('Same as', {
      link: text('Link'),
      title: heading('Title (override)')
    }),
    twitterHandle: text('Twitter handle (deprecated)')
  }
};
