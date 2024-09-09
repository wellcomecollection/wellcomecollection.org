import { Format } from './format';
import { GenericContentFields } from './generic-content-fields';
import { Season } from './seasons';

export type Project = GenericContentFields & {
  type: 'projects';
  uid: string;
  format?: Format;
  seasons: Season[];
};
