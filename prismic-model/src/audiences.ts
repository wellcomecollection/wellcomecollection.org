import title from './parts/title';
import { singleLineText } from './parts/structured-text';
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
};

export default audiences;
