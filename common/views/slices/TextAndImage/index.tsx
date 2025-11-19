import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { TextAndImageSlice as RawTextAndImageSlice } from '@weco/common/prismicio-types';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformTextAndImage } from '@weco/content/services/prismic/transformers/body';
import {
  defaultContext,
  SliceZoneContext,
} from '@weco/content/views/components/Body';
import TextAndImageOrIcons from '@weco/content/views/components/TextAndImageOrIcons';

export type TextAndImageProps = SliceComponentProps<
  RawTextAndImageSlice,
  SliceZoneContext
>;

const TextAndImageSlice: FunctionComponent<TextAndImageProps> = ({
  slice,
  context,
}) => {
  const options = { ...defaultContext, ...context };
  const transformedSlice = transformTextAndImage(slice);
  const content = <TextAndImageOrIcons item={transformedSlice.value} />;

  return (
    <SpacingComponent
      $sliceType={transformedSlice.type}
      $sliceId={options.stickyNavA11y ? slice.id : undefined}
      $useSectionElement={options.stickyNavA11y}
    >
      {options.isInGridCell && options.stickyNavA11y ? (
        content
      ) : (
        <ContaineredLayout gridSizes={gridSize8()}>{content}</ContaineredLayout>
      )}
    </SpacingComponent>
  );
};

export default TextAndImageSlice;
