import { GenericContentFields } from './generic-content-fields';
import { HTMLString } from '../services/prismic/types';
export type Place = GenericContentFields & {
  id: string;
  title: string;
  level: number;
  capacity?: number;
  information?: HTMLString;
};
