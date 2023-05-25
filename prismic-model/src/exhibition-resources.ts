import label from './types/label';
import select from './parts/select';
import { CustomType } from './types/CustomType';

const typeLabel = 'Exhibition resource';
const labelObject = label(typeLabel);
const exhibitionResources: CustomType = {
  id: 'exhibition-resources',
  label: typeLabel,
  repeatable: true,
  status: true,
  json: {
    [typeLabel]: {
      ...labelObject[typeLabel],
      icon: select('Icon type', { options: ['information', 'family'] }),
    },
  },
  format: 'custom',
};

export default exhibitionResources;
