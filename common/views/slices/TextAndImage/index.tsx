import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { TextAndImageSlice as RawTextAndImageSlice } from '@weco/common/prismicio-types';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
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
      <ConditionalWrapper
        condition={!!context.gridSizes}
        wrapper={children => (
          <ContaineredLayout gridSizes={context.gridSizes!}>
            {children}
          </ContaineredLayout>
        )}
      >
        <TextAndImageOrIcons item={transformedSlice.value} />
      </ConditionalWrapper>
    </SpacingComponent>
  );
};

export default TextAndImageSlice;
