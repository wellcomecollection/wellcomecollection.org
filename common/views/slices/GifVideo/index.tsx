import { GifVideoSlice as SliceType } from '../../../prismicio-types';
import { FunctionComponent } from 'react';
import { SliceComponentProps } from '@prismicio/react';
import SpacingComponent from '../../components/styled/SpacingComponent';
import Layout, { gridSize10 } from '@weco/common/views/components/Layout';
import { transformGifVideoSlice } from '@weco/content/services/prismic/transformers/body';
import GifVideo from '@weco/content/components/GifVideo/GifVideo';

export type GifVideoProps = SliceComponentProps<SliceType>;

const GifVideoSlice: FunctionComponent<GifVideoProps> = ({ slice }) => {
  const transformedSlice = transformGifVideoSlice(slice);
  if (transformedSlice) {
    return (
      <SpacingComponent $sliceType={transformedSlice.type}>
        <Layout gridSizes={gridSize10()}>
          <GifVideo {...transformedSlice.value} />
        </Layout>
      </SpacingComponent>
    );
  } else {
    return null;
  }
};

export default GifVideoSlice;
