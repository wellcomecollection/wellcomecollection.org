import { EditorialImageGallerySlice as SliceType } from '@weco/common/prismicio-types';
import { FunctionComponent } from 'react';
import ImageGallery from '@weco/content/components/ImageGallery';
import { SliceComponentProps } from '@prismicio/react';
import SpacingComponent from '../../components/styled/SpacingComponent';
import { transformEditorialImageGallerySlice } from '@weco/content/services/prismic/transformers/body';
import {
  defaultContext,
  SliceZoneContext,
} from '@weco/content/components/Body/Body';

export type EditorialImageGalleryProps = SliceComponentProps<
  SliceType,
  SliceZoneContext
>;

const EditorialImageGallerySlice: FunctionComponent<
  EditorialImageGalleryProps
> = ({ slice, slices, context }) => {
  const isStandalone = context.contentType === 'standalone-image-gallery';
  const transformedSlice = transformEditorialImageGallerySlice(
    slice,
    isStandalone
  );
  const options = { ...defaultContext, ...context };
  const allImageGallerySlices = slices.filter(
    slice => slice.slice_type === 'editorialImageGallery'
  );
  const index = allImageGallerySlices.findIndex(s => s.id === slice.id);

  return transformedSlice.value.items?.length ? (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <ImageGallery
        {...transformedSlice.value}
        id={index + 1}
        comicPreviousNext={options.comicPreviousNext}
      />
    </SpacingComponent>
  ) : null;
};

export default EditorialImageGallerySlice;
