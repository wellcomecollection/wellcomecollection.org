import { CustomType } from './types/CustomType';
import label from './types/label';

const pageFormats: CustomType = {
  id: 'page-formats',
  label: 'Page format',
  repeatable: true,
  status: true,
  json: label('Page format'),
  format: 'custom',
};

export default pageFormats;
