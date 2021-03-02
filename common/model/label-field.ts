import { HTMLString } from '../services/prismic/types';
import { ArticleFormatId } from './content-format-id';

export type LabelField = {
  id?: ArticleFormatId;
  title?: string;
  description?: HTMLString;
};
