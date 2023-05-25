import { CustomType } from './types/CustomType';
import label from './types/label';

const labels: CustomType = {
  id: 'labels',
  label: 'Label',
  repeatable: true,
  status: true,
  json: label('Label'),
  format: 'custom',
};

export default labels;
