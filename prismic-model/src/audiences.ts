import title from './parts/title';
import { singleLineText } from './parts/text';
import { CustomType } from './types/CustomType';

const audiences: CustomType = {
  id: 'audiences',
  label: 'Audience',
  repeatable: true,
  status: true,
  json: {
    Audience: {
      title,
      description: singleLineText('Description'),
    },
  },
  format: 'custom',
};

export default audiences;
