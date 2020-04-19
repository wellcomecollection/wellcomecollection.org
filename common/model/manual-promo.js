import { type UiImageProps } from '@weco/common/views/components/Images/Images';

export type ManualPromo = {|
  type: 'manualPromo',
  title: ?string,
  summary: ?string,
  image: ?UiImageProps,
  url: ?string,
|};
