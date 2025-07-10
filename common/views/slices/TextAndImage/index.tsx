import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { TextAndImageSlice as RawTextAndImageSlice } from '@weco/common/prismicio-types';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformTextAndImage } from '@weco/content/services/prismic/transformers/body';
import TextAndImageOrIcons from '@weco/content/views/components/TextAndImageOrIcons';

export type TextAndImageProps = SliceComponentProps<RawTextAndImageSlice>;

const TextAndImageSlice: FunctionComponent<TextAndImageProps> = ({ slice }) => {
  const transformedSlice = transformTextAndImage(slice);
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <ContaineredLayout gridSizes={gridSize8()}>
        <TextAndImageOrIcons item={transformedSlice.value} />
      </ContaineredLayout>
    </SpacingComponent>
  );
};

export default TextAndImageSlice;
