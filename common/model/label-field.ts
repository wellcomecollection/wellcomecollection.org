import { HTMLString } from '../services/prismic/types';
import { ContentFormatId } from './content-format-id';

export type LabelField = {
  id?: ContentFormatId;
  title?: string;
  description?: HTMLString;
};
