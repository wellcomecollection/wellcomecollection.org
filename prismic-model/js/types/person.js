// @flow
import createThing from '../interfaces/Thing';
import text from '../parts/text';
import list from '../parts/list';
import structuredText from '../parts/structured-text';

const Person = createThing('person', {
  sameAs: list('Same as', {
    link: text('Link'),
    title: structuredText('Link text', 'single'),
  }),
});

export default Person;
