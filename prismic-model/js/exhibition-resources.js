import label from './types/label';
import select from './parts/select';

const typeLabel = 'Exhibition resource';
const labelObject = label(typeLabel);
const exhibitionResources = {
  [typeLabel]: {
    ...labelObject[typeLabel],
    icon: select('Icon type', ['information', 'family'])
  }
};

export default exhibitionResources;
