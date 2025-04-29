import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { IframeSlice as RawIframeSlice } from '@weco/common/prismicio-types';
import Iframe from '@weco/common/views/components/Iframe';
import {
  ContaineredLayout,
  gridSize10,
} from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformIframeSlice } from '@weco/content/services/prismic/transformers/body';
export type IframeProps = SliceComponentProps<RawIframeSlice>;

const IframeSlice: FunctionComponent<IframeProps> = ({ slice }) => {
  const transformedSlice = transformIframeSlice(slice);
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <ContaineredLayout gridSizes={gridSize10()}>
        <Iframe {...transformedSlice.value} />
      </ContaineredLayout>
    </SpacingComponent>
  );
};

export default IframeSlice;
