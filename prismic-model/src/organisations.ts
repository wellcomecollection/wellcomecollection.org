import keyword from './parts/keyword';
import description from './parts/description';
import image from './parts/image';
import list from './parts/list';
import title from './parts/title';
import { CustomType } from './types/CustomType';
import { singleLineText } from './parts/text';

const organisations: CustomType = {
  id: 'organisations',
  label: 'Organisation',
  repeatable: true,
  status: true,
  json: {
    Organisation: {
      name: title,
      description,
      image: image('Image'),
      sameAs: list('Same as', {
        link: keyword('Link', {
          placeholder: 'https://example.com/organisation (required)',
        }),
        title: singleLineText('Title', {
          placeholder: 'The official website of Organisation (required)',
        }),
      }),
    },
  },
  format: 'custom',
};

export default organisations;
