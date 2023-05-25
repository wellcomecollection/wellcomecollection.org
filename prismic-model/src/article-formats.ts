import { CustomType } from './types/CustomType';
import label from './types/label';

const articleFormats: CustomType = {
  id: 'article-formats',
  label: 'Story format',
  repeatable: true,
  status: true,
  json: label('Article format'),
  format: 'custom',
};

export default articleFormats;
