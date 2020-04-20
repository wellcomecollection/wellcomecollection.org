// @flow
import type { HTMLString } from '../services/prismic/types';
import { type UiImageProps } from '@weco/common/views/components/Images/Images';

export type ManualPromo = {|
  type: 'manualPromo',
  format: ?{ id: string, title: string, description: ?HTMLString },
  title: ?string,
  summary: ?string,
  image: ?UiImageProps,
  url: ?string,
|};
