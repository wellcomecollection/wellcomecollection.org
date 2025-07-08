import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { TextAndIconsSlice as RawTextAndIconsSlice } from '@weco/common/prismicio-types';
import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import TextAndImageOrIcons from '@weco/content/views/components/TextAndImageOrIcons';
import { transformTextAndIcons } from '@weco/content/services/prismic/transformers/body';

export type TextAndIconsProps = SliceComponentProps<RawTextAndIconsSlice>;

const TextAndIconsSlice: FunctionComponent<TextAndIconsProps> = ({ slice }) => {
  const transformedSlice = transformTextAndIcons(slice);

  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <ContaineredLayout gridSizes={gridSize8()}>
        <TextAndImageOrIcons item={transformedSlice.value} />
      </ContaineredLayout>
    </SpacingComponent>
  );
};

export default TextAndIconsSlice;
