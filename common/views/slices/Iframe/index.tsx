import { IframeSlice } from '../../../prismicio-types';
import { FunctionComponent } from 'react';
import { SliceComponentProps } from '@prismicio/react';
import SpacingComponent from '../../components/styled/SpacingComponent';
import Layout, { gridSize10 } from '@weco/common/views/components/Layout';
import { transformIframeSlice } from '@weco/content/services/prismic/transformers/body';
import Iframe from '@weco/common/views/components/Iframe/Iframe';
export type IframeProps = SliceComponentProps<IframeSlice>;

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
