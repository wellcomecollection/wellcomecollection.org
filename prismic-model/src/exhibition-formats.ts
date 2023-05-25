import { CustomType } from './types/CustomType';
import label from './types/label';

const exhibitionFormats: CustomType = {
  id: 'exhibition-formats',
  label: 'Exhibition format',
  repeatable: true,
  status: true,
  json: label('Exhibition format'),
  format: 'custom',
};

export default exhibitionFormats;
