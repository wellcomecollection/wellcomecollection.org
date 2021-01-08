import { GenericContentFields } from './generic-content-fields';
import { Season } from './seasons';
export type Project = {
  type: 'projects';
  seasons: Season[];
} & GenericContentFields;
