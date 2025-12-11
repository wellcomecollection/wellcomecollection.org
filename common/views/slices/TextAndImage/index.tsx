import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { TextAndImageSlice as RawTextAndImageSlice } from '@weco/common/prismicio-types';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformTextAndImage } from '@weco/content/services/prismic/transformers/body';
import { SliceZoneContext } from '@weco/content/views/components/Body';
import TextAndImageOrIcons from '@weco/content/views/components/TextAndImageOrIcons';

export type TextAndImageProps = SliceComponentProps<
  RawTextAndImageSlice,
  SliceZoneContext
>;

const TextAndImageSlice: FunctionComponent<TextAndImageProps> = ({
  slice,
  context,
}) => {
  const transformedSlice = transformTextAndImage(slice);
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <ContaineredLayout gridSizes={context.gridSizes}>
        <TextAndImageOrIcons item={transformedSlice.value} />
      </ContaineredLayout>
    </SpacingComponent>
  );
};

export default TextAndImageSlice;
