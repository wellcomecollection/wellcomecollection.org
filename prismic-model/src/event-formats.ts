import { CustomType } from './types/CustomType';
import label from './types/label';

const eventFormats: CustomType = {
  id: 'event-formats',
  label: 'Event format',
  repeatable: true,
  status: true,
  json: label('Event format'),
  format: 'custom',
};

export default eventFormats;
