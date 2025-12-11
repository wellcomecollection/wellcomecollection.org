import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { TextAndIconsSlice as RawTextAndIconsSlice } from '@weco/common/prismicio-types';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformTextAndIcons } from '@weco/content/services/prismic/transformers/body';
import { SliceZoneContext } from '@weco/content/views/components/Body';
import TextAndImageOrIcons from '@weco/content/views/components/TextAndImageOrIcons';

export type TextAndIconsProps = SliceComponentProps<
  RawTextAndIconsSlice,
  SliceZoneContext
>;

const TextAndIconsSlice: FunctionComponent<TextAndIconsProps> = ({
  slice,
  context,
}) => {
  const transformedSlice = transformTextAndIcons(slice);

  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <ContaineredLayout gridSizes={context.gridSizes}>
        <TextAndImageOrIcons item={transformedSlice.value} />
      </ContaineredLayout>
    </SpacingComponent>
  );
};

export default TextAndIconsSlice;
