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
      description: description,
      pronouns: keyword('Pronouns'),
      image: image('Image'),
      sameAs: list('Same as', {
        link: keyword('Link'),
        title: singleLineText('Link text'),
      }),
    },
  },
};

export default people;
