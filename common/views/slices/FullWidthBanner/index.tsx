import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { FullWidthBannerSlice as RawFullWidthBannerSlice } from '@weco/common/prismicio-types';
import { transformFullWidthBanner } from '@weco/content/services/prismic/transformers/body';
import FullWidthBanner from '@weco/content/views/components/FullWidthBanner';

export type FullWidthBannerProps = SliceComponentProps<RawFullWidthBannerSlice>;

const FullWidthBannerSlice: FunctionComponent<FullWidthBannerProps> = ({
  slice,
}) => {
  const transformedSlice = transformFullWidthBanner(slice);

  return <FullWidthBanner {...transformedSlice.value} />;
};

export default FullWidthBannerSlice;
