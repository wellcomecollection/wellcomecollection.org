import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { IframeSlice as RawIframeSlice } from '@weco/common/prismicio-types';
import Iframe from '@weco/common/views/components/Iframe/Iframe';
import Layout, { gridSize10 } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformIframeSlice } from '@weco/content/services/prismic/transformers/body';
export type IframeProps = SliceComponentProps<RawIframeSlice>;

const IframeSlice: FunctionComponent<IframeProps> = ({ slice }) => {
  const transformedSlice = transformIframeSlice(slice);
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <Layout gridSizes={gridSize10()}>
        <Iframe {...transformedSlice.value} />
      </Layout>
    </SpacingComponent>
  );
};

export default IframeSlice;
