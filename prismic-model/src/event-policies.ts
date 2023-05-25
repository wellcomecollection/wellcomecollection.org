import { CustomType } from './types/CustomType';
import label from './types/label';

const eventPolicies: CustomType = {
  id: 'event-policies',
  label: 'Event policy',
  repeatable: true,
  status: true,
  json: label('Event policy'),
  format: 'custom',
};

export default eventPolicies;
