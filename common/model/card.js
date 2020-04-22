// @flow
import type { HTMLString } from '../services/prismic/types';
import { type ImageType } from '@weco/common/model/Image';

export type Card = {|
  type: 'card',
  format: ?{ id: string, title: string, description: ?HTMLString },
  title: ?string,
  description: ?string,
  image: ?ImageType,
  link: ?string,
|};
