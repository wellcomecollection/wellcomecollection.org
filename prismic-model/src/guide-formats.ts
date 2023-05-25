import { CustomType } from './types/CustomType';
import label from './types/label';

const guideFormat: CustomType = {
  id: 'guide-formats',
  label: 'Guide format',
  repeatable: true,
  status: true,
  json: label('Guide format'),
  format: 'custom',
};

export default guideFormat;
