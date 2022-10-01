import keyword from './parts/keyword';
import description from './parts/description';
import image from './parts/image';
import list from './parts/list';
import title from './parts/title';
import heading from './parts/heading';
import { CustomType } from './types/CustomType';

const organisations: CustomType = {
  id: 'organisations',
  label: 'Organisation',
  repeatable: true,
  status: true,
  json: {
    Organisation: {
      name: title,
      description: description,
      image: image('Image'),
      sameAs: list('Same as', {
        link: keyword('Link'),
        title: heading('Title (override)'),
      }),
    },
  },
};

export default organisations;
