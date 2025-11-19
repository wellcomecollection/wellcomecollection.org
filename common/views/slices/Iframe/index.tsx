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
import {
  defaultContext,
  SliceZoneContext,
} from '@weco/content/views/components/Body';

export type IframeProps = SliceComponentProps<RawIframeSlice, SliceZoneContext>;

const IframeSlice: FunctionComponent<IframeProps> = ({ slice, context }) => {
  const options = { ...defaultContext, ...context };
  const transformedSlice = transformIframeSlice(slice);
  const content = <Iframe {...transformedSlice.value} />;

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
};

export default IframeSlice;
