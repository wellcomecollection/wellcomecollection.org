// @flow
import type { HTMLString } from '../services/prismic/types';
import type { ArticleFormatId } from './content-format-id';

export type LabelField = {|
  id: ?ArticleFormatId,
  title: ?string,
  description: ?HTMLString,
|};
