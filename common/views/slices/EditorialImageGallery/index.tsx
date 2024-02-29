import { Content } from '@prismicio/client';
import { FunctionComponent } from 'react';
import ImageGallery from '@weco/content/components/ImageGallery';
import { SliceComponentProps } from '@prismicio/react';
import SpacingComponent from '../../components/styled/SpacingComponent';
import { transformEditorialImageGallerySlice } from '@weco/content/services/prismic/transformers/body';
import { defaultContext } from '@weco/content/components/Body/Body';

export type EditorialImageGalleryProps =
  SliceComponentProps<Content.EditorialImageGallerySlice>;

const EditorialImageGallerySlice: FunctionComponent<
  EditorialImageGalleryProps
> = ({ slice, context }) => {
  const transformedSlice = transformEditorialImageGallerySlice(slice);
  const options = { ...defaultContext, ...context };
  // TODO: increment `id` based on the image gallery's position within all the
  // possible image gallery slices (probably using `slices` and `index` props)
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <ImageGallery
        {...transformedSlice.value}
        id={1}
        comicPreviousNext={options.comicPreviousNext}
      />
    </SpacingComponent>
  );
};

export default EditorialImageGallerySlice;
