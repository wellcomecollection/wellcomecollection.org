// @flow
import type { EventFormat } from '@weco/common/model/events';
import { type UiImageProps } from '@weco/common/views/components/Images/Images';

export type ManualPromo = {|
  type: 'manualPromo',
  format: ?EventFormat,
  title: ?string,
  summary: ?string,
  image: ?UiImageProps,
  url: ?string,
|};
