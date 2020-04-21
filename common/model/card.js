// @flow
import type { HTMLString } from '../services/prismic/types';
import { type UiImageProps } from '@weco/common/views/components/Images/Images';

export type Card = {|
  type: 'card',
  format: ?{ id: string, title: string, description: ?HTMLString },
  title: ?string,
  description: ?string,
  image: ?UiImageProps,
  link: ?string,
|};
