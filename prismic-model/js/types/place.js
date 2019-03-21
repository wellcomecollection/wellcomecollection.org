// @flow
import createThing from '../interfaces/Thing';
import text from '../parts/text';
import description from '../parts/description';
import image from '../parts/image';
import list from '../parts/list';
import structuredText from '../parts/structured-text';

const Place = createThing('place', {
  description: description,
  image: image('Image'),
  sameAs: list('Same as', {
    link: text('Link'),
    title: structuredText('Link text', 'single'),
  }),
});

export default Place;
