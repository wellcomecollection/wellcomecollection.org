import { FunctionComponent } from 'react';
import ImageGallery, { Props } from '@weco/content/components/ImageGallery';
import { SliceComponentProps } from '@prismicio/react';
import SpacingComponent from '../../components/styled/SpacingComponent';

type ImageGallerySliceProps = SliceComponentProps<{
  type: 'imageGallery';
  value: Props;
}>;

const ImageGallerySlice: FunctionComponent<ImageGallerySliceProps> = ({
  slice,
  slices,
  context,
  index,
}) => {
  const imageGallerySlices = slices
    .map((slice, index) => ({ ...slice, index }))
    .filter(s => s.type === 'imageGallery');

  const imageGalleryIndex = imageGallerySlices.findIndex(
    s => s.index === index
  );
  const imageGalleryNumber = imageGalleryIndex + 1;

  return (
    <SpacingComponent $sliceType={slice.type}>
      <ImageGallery
        {...slice.value}
        id={imageGalleryNumber}
        comicPreviousNext={context.comicPreviousNext}
      />
    </SpacingComponent>
  );
};

export default ImageGallerySlice;
