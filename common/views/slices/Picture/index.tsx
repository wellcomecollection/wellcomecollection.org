import { FunctionComponent } from 'react';
import { SliceComponentProps } from '@prismicio/react';
import SpacingComponent from '../../components/styled/SpacingComponent';
import { LayoutWidth } from '@weco/content/components/Body/Body';
import CaptionedImage, {
  CaptionedImageProps,
} from '@weco/content/components/CaptionedImage/CaptionedImage';

export type PictureSliceProps = SliceComponentProps<{
  type: 'picture';
  value: CaptionedImageProps;
}>;

const PictureSlice: FunctionComponent<PictureSliceProps> = ({
  slice,
  context,
}) => {
  return (
    <SpacingComponent $sliceType={slice.type}>
      <LayoutWidth width={context.isVisualStory ? 8 : 10}>
        <CaptionedImage {...slice.value} />
      </LayoutWidth>
    </SpacingComponent>
  );
};

export default PictureSlice;
