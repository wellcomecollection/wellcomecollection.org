import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { GifVideoSlice as RawGifVideoSlice } from '@weco/common/prismicio-types';
import {
  ContaineredLayout,
  gridSize10,
} from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformGifVideoSlice } from '@weco/content/services/prismic/transformers/body';
import {
  defaultContext,
  SliceZoneContext,
} from '@weco/content/views/components/Body';
import GifVideo from '@weco/content/views/components/GifVideo';

export type GifVideoProps = SliceComponentProps<
  RawGifVideoSlice,
  SliceZoneContext
>;

const GifVideoSlice: FunctionComponent<GifVideoProps> = ({
  slice,
  context,
}) => {
  const options = { ...defaultContext, ...context };
  const transformedSlice = transformGifVideoSlice(slice);
  if (transformedSlice) {
    const content = <GifVideo {...transformedSlice.value} />;

    return (
      <SpacingComponent
        $sliceType={transformedSlice.type}
        $sliceId={options.stickyNavA11y ? slice.id : undefined}
        $useSectionElement={options.stickyNavA11y}
      >
        {options.isInGridCell && options.stickyNavA11y ? (
          content
        ) : (
          <ContaineredLayout gridSizes={gridSize10()}>
            {content}
          </ContaineredLayout>
        )}
      </SpacingComponent>
    );
  } else {
    return null;
  }
};

export default GifVideoSlice;
