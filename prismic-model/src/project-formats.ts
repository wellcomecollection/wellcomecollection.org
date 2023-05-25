import { CustomType } from './types/CustomType';
import label from './types/label';

const projectFormat: CustomType = {
  id: 'project-formats',
  label: 'Project format',
  repeatable: true,
  status: true,
  json: label('Project format'),
  format: 'custom',
};

export default projectFormat;
