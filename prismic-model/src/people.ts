import keyword from './parts/keyword';
import description from './parts/description';
import image from './parts/image';
import list from './parts/list';
import { singleLineText } from './parts/text';
import { CustomType } from './types/CustomType';

const people: CustomType = {
  id: 'people',
  label: 'Person',
  repeatable: true,
  status: true,
  json: {
    Person: {
      name: keyword('Full name'),
      description,
      pronouns: keyword('Pronouns'),
      image: image('Image'),
      sameAs: list('Same as', {
        link: keyword('Link', {
          placeholder: 'https://example.com/person (required)',
        }),
        title: singleLineText('Link text', {
          placeholder: 'The personal website of Person (required)',
        }),
      }),
    },
  },
  format: 'custom',
};

export default people;
