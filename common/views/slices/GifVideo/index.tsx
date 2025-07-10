import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { GifVideoSlice as RawGifVideoSlice } from '@weco/common/prismicio-types';
import {
  ContaineredLayout,
  gridSize10,
} from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformGifVideoSlice } from '@weco/content/services/prismic/transformers/body';
import GifVideo from '@weco/content/views/components/GifVideo';

export type GifVideoProps = SliceComponentProps<RawGifVideoSlice>;

const GifVideoSlice: FunctionComponent<GifVideoProps> = ({ slice }) => {
  const transformedSlice = transformGifVideoSlice(slice);
  if (transformedSlice) {
    return (
      <SpacingComponent $sliceType={transformedSlice.type}>
        <ContaineredLayout gridSizes={gridSize10()}>
          <GifVideo {...transformedSlice.value} />
        </ContaineredLayout>
      </SpacingComponent>
    );
  } else {
    return null;
  }
};

export default GifVideoSlice;
